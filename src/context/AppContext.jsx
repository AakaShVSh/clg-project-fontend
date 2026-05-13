// src/context/AppContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { channelAPI, subgroupAPI, dmAPI, userAPI, messageAPI } from "../api/api";
import { AuthContext } from "./AuthContext";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { user, authLoading } = useContext(AuthContext);

  /* ── Navigation ── */
  const [view,             setView]             = useState("channel");
  const [activeChannelId,  setActiveChannelId]  = useState(null);
  const [activeSubgroupId, setActiveSubgroupId] = useState(null);
  const [activeDMId,       setActiveDMId]       = useState(null);
  const [activeGroupDMId,  setActiveGroupDMId]  = useState(null);

  /* ── Data ── */
  const [channels,           setChannels]           = useState([]);
  const [subgroupsByChannel, setSubgroupsByChannel] = useState({});
  const [membersByChannel,   setMembersByChannel]   = useState({});
  const [dms,                setDMs]                = useState([]);
  const [groupDMs,           setGroupDMs]           = useState([]);
  const [companyUsers,       setCompanyUsers]       = useState([]);

  /* ── Messages cache ── */
  const [messages, setMessages] = useState({});

  /* ── UI ── */
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [error,           setError]           = useState(null);

  const msgKey = (type, id) => `${type}:${id}`;

  /* ─── Load channels ─── */
  const loadChannels = useCallback(async () => {
    try {
      setLoadingChannels(true);
      const data = await channelAPI.list();
      setChannels(data);
      setActiveChannelId((prev) => (!prev && data.length > 0) ? data[0]._id : prev);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingChannels(false);
    }
  }, []);

  /* ─── Load subgroups ─── */
  const subgroupsRef = useRef({});
  useEffect(() => { subgroupsRef.current = subgroupsByChannel; }, [subgroupsByChannel]);

  const loadSubgroups = useCallback(async (channelId) => {
    if (subgroupsRef.current[channelId]) return;
    try {
      const data = await channelAPI.getSubgroups(channelId);
      setSubgroupsByChannel((prev) => ({ ...prev, [channelId]: data }));
    } catch (e) { console.error("loadSubgroups:", e); }
  }, []);

  /* ─── Load members ─── */
  const loadMembers = useCallback(async (channelId) => {
    try {
      const data = await channelAPI.getMembers(channelId);
      setMembersByChannel((prev) => ({ ...prev, [channelId]: data }));
    } catch (e) { console.error("loadMembers:", e); }
  }, []);

  /* ─── Load messages ─── */
  const messagesRef = useRef({});
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const loadMessages = useCallback(async (type, id) => {
    const key = msgKey(type, id);
    if (messagesRef.current[key]) return;
    try {
      let data;
      if (type === "dm" || type === "groupdm") {
        data = await dmAPI.getMessages(id, { limit: 60 });
      } else {
        const paramMap = { channel: "channelId", subgroup: "subgroupId" };
        data = await messageAPI.list({ [paramMap[type]]: id, limit: 60 });
      }
      setMessages((prev) => ({ ...prev, [key]: data }));
    } catch (e) { console.error("loadMessages:", e); }
  }, []);

  /* ─── Send message ─── */
  const sendMessage = useCallback(async (content, attachments = []) => {
    if (!content.trim() && !attachments.length) return;
    const key = view === "channel"  ? msgKey("channel",  activeChannelId)
              : view === "subgroup" ? msgKey("subgroup", activeSubgroupId)
              : view === "dm"       ? msgKey("dm",       activeDMId)
              : view === "groupdm"  ? msgKey("groupdm",  activeGroupDMId)
              : null;
    if (!key) return;

    const optimistic = {
      _id: `tmp-${Date.now()}`,
      senderId: { _id: user?.id || user?._id, name: user?.name, avatar_url: user?.avatar_url },
      content,
      createdAt: new Date().toISOString(),
      _optimistic: true,
    };
    setMessages((prev) => ({ ...prev, [key]: [...(prev[key] || []), optimistic] }));

    try {
      let saved;
      if (view === "dm") {
        saved = await dmAPI.sendMessage(activeDMId, { content });
      } else if (view === "groupdm") {
        saved = await dmAPI.sendMessage(activeGroupDMId, { content });
      } else {
        const bodyKey = view === "channel" ? "channelId" : "subgroupId";
        const bodyId  = view === "channel" ? activeChannelId : activeSubgroupId;
        saved = await messageAPI.send({ [bodyKey]: bodyId, content });
      }
      setMessages((prev) => ({
        ...prev,
        [key]: (prev[key] || []).map((m) => m._id === optimistic._id ? saved : m),
      }));
    } catch (e) {
      setMessages((prev) => ({
        ...prev,
        [key]: (prev[key] || []).filter((m) => m._id !== optimistic._id),
      }));
      throw e;
    }
  }, [view, activeChannelId, activeSubgroupId, activeDMId, activeGroupDMId, user]);

  /* ─── Append real-time message ─── */
  const appendMessage = useCallback((type, id, msg) => {
    const key = msgKey(type, id);
    setMessages((prev) => {
      const existing = prev[key] || [];
      if (existing.find((m) => m._id === msg._id)) return prev;
      return { ...prev, [key]: [...existing, msg] };
    });
  }, []);

  const createChannel = useCallback(async (body) => {
    const ch = await channelAPI.create(body);
    setChannels((prev) => [...prev, ch]);
    return ch;
  }, []);

  const createSubgroup = useCallback(async (body) => {
    const sg = await subgroupAPI.create(body);
    setSubgroupsByChannel((prev) => ({
      ...prev,
      [sg.channelId]: [...(prev[sg.channelId] || []), sg],
    }));
    return sg;
  }, []);

  /* ─── Navigation ─── */
  const openChannel = useCallback((channelId) => {
    setActiveChannelId(channelId);
    setActiveSubgroupId(null);
    setView("channel");
    loadSubgroups(channelId);
    loadMembers(channelId);
    loadMessages("channel", channelId);
  }, [loadSubgroups, loadMembers, loadMessages]);

  const openSubgroup = useCallback((subgroupId, channelId) => {
    setActiveChannelId(channelId);
    setActiveSubgroupId(subgroupId);
    setView("subgroup");
    loadMessages("subgroup", subgroupId);
  }, [loadMessages]);

  const openDM = useCallback(async (userId) => {
    try {
      const dm = await dmAPI.getOrCreate(userId);
      setActiveDMId(dm._id);
      setView("dm");
      loadMessages("dm", dm._id);
      setDMs((prev) => prev.find((d) => d._id === dm._id) ? prev : [dm, ...prev]);
    } catch (e) { console.error("openDM:", e); }
  }, [loadMessages]);

  const openGroupDM = useCallback((groupDMId) => {
    setActiveGroupDMId(groupDMId);
    setView("groupdm");
    loadMessages("groupdm", groupDMId);
  }, [loadMessages]);

  /* ─── Derived ─── */
  const activeChannel  = channels.find((c) => c._id === activeChannelId) || null;
  const activeSubgroup = (subgroupsByChannel[activeChannelId] || []).find((s) => s._id === activeSubgroupId) || null;
  const activeDM       = dms.find((d) => d._id === activeDMId) || null;
  const activeGroupDM  = groupDMs.find((g) => g._id === activeGroupDMId) || null;

  const currentMessages = (() => {
    if (view === "channel")  return messages[msgKey("channel",  activeChannelId)]  || [];
    if (view === "subgroup") return messages[msgKey("subgroup", activeSubgroupId)] || [];
    if (view === "dm")       return messages[msgKey("dm",       activeDMId)]       || [];
    if (view === "groupdm")  return messages[msgKey("groupdm",  activeGroupDMId)]  || [];
    return [];
  })();

  const currentMembers = membersByChannel[activeChannelId] || [];

  /* ─── Bootstrap ───────────────────────────────────────────────────────────
     Wait for authLoading=false before firing any API calls.
     Firing before auth resolves means the token may not be in localStorage,
     which causes 401 "Invalid or expired token" on channels, users, dm, etc.
  ─────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (authLoading || !user) return;
    loadChannels();
    userAPI.list().then(setCompanyUsers).catch(() => {});
    dmAPI.listDMs().then(setDMs).catch(() => {});
    dmAPI.listGroupDMs().then(setGroupDMs).catch(() => {});
  }, [authLoading, user]); // eslint-disable-line

  useEffect(() => {
    if (!activeChannelId || authLoading) return;
    loadSubgroups(activeChannelId);
    loadMembers(activeChannelId);
    if (view === "channel") loadMessages("channel", activeChannelId);
  }, [activeChannelId]); // eslint-disable-line

  return (
    <AppContext.Provider value={{
      view, activeChannelId, activeSubgroupId, activeDMId, activeGroupDMId,
      activeChannel, activeSubgroup, activeDM, activeGroupDM,
      openChannel, openSubgroup, openDM, openGroupDM,
      channels, setChannels,
      subgroupsByChannel, setSubgroupsByChannel,
      membersByChannel,
      dms, setDMs,
      groupDMs, setGroupDMs,
      companyUsers,
      currentMessages,
      currentMembers,
      sendMessage, appendMessage,
      createChannel, createSubgroup,
      loadChannels, loadSubgroups, loadMembers,
      loadingChannels, error,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);