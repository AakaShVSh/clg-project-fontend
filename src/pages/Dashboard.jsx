




// // src/pages/Dashboard.jsx
// import { useState, useRef, useEffect, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// /* ─── Icons ─── */
// const Icon = ({ d, size = 16 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//     <path d={d} />
//   </svg>
// );

// const priorityColor = { high: "#e88080", medium: "#e8b080", low: "#8ab4e8", High: "#e88080", Medium: "#e8b080", Low: "#8ab4e8" };

// /* ─── API helper ─── */
// const apiFetch = async (path, options = {}) => {
//   const token = localStorage.getItem("token");
//   const res = await fetch(`${API}${path}`, {
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//     ...options,
//   });
//   if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
//   return res.json();
// };

// /* ─── Avatar initials helper ─── */
// const initials = (name = "") =>
//   name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const { user, logout } = useContext(AuthContext);

//   /* ── State ── */
//   const [channels, setChannels]         = useState([]);
//   const [members, setMembers]           = useState([]);
//   const [messages, setMessages]         = useState({}); // { [channelId]: [...] }
//   const [activeChannel, setActiveChannel] = useState(null);
//   const [input, setInput]               = useState("");
//   const [sidebarOpen, setSidebarOpen]   = useState(true);
//   const [rightOpen, setRightOpen]       = useState(true);
//   const [activeTab, setActiveTab]       = useState("members");
//   const [searchQ, setSearchQ]           = useState("");
//   const [loading, setLoading]           = useState(true);
//   const [sending, setSending]           = useState(false);
//   const [error, setError]               = useState(null);

//   const bottomRef = useRef(null);
//   const inputRef  = useRef(null);

//   /* ── Load channels on mount ── */
//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         const data = await apiFetch("/channels");
//         setChannels(data);
//         if (data.length > 0) setActiveChannel(data[0]._id);
//       } catch (err) {
//         setError("Failed to load channels");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   /* ── Load messages when channel changes ── */
//   useEffect(() => {
//     if (!activeChannel) return;
//     if (messages[activeChannel]) return; // already cached

//     (async () => {
//       try {
//         const data = await apiFetch(`/messages?channelId=${activeChannel}&limit=50`);
//         setMessages((prev) => ({ ...prev, [activeChannel]: data }));
//       } catch (err) {
//         console.error("Failed to load messages:", err);
//       }
//     })();
//   }, [activeChannel]);

//   /* ── Load members when channel changes ── */
//   useEffect(() => {
//     if (!activeChannel) return;
//     (async () => {
//       try {
//         const data = await apiFetch(`/channels/${activeChannel}/members`);
//         setMembers(data);
//       } catch (err) {
//         console.error("Failed to load members:", err);
//       }
//     })();
//   }, [activeChannel]);

//   /* ── Scroll to bottom on new messages ── */
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages[activeChannel]?.length, activeChannel]);

//   /* ── Send message ── */
//   const sendMessage = async () => {
//     const text = input.trim();
//     if (!text || !activeChannel || sending) return;
//     setSending(true);

//     // Optimistic update
//     const optimistic = {
//       _id:      `tmp-${Date.now()}`,
//       senderId: { _id: user?.id, name: user?.name, avatar_url: user?.avatar_url },
//       content:  text,
//       createdAt: new Date().toISOString(),
//       _optimistic: true,
//     };
//     setMessages((prev) => ({ ...prev, [activeChannel]: [...(prev[activeChannel] || []), optimistic] }));
//     setInput("");
//     inputRef.current?.focus();

//     try {
//       const saved = await apiFetch("/messages", {
//         method: "POST",
//         body: JSON.stringify({ channelId: activeChannel, content: text }),
//       });
//       // Replace optimistic message with real one
//       setMessages((prev) => ({
//         ...prev,
//         [activeChannel]: prev[activeChannel].map((m) => m._id === optimistic._id ? saved : m),
//       }));
//     } catch (err) {
//       console.error("Send failed:", err);
//       // Remove optimistic message on failure
//       setMessages((prev) => ({
//         ...prev,
//         [activeChannel]: prev[activeChannel].filter((m) => m._id !== optimistic._id),
//       }));
//       setInput(text); // restore input
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleKey = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
//   };

//   const handleLogout = async () => {
//     try {
//       await apiFetch("/auth/logout", { method: "POST" });
//     } catch (_) {}
//     if (logout) logout();
//     navigate("/login");
//   };

//   const handleChannelClick = (channelId) => {
//     setActiveChannel(channelId);
//   };

//   const channel       = channels.find((c) => c._id === activeChannel);
//   const msgs          = messages[activeChannel] || [];
//   const filteredChannels = channels.filter((c) =>
//     c.name.toLowerCase().includes(searchQ.toLowerCase())
//   );

//   const currentUserInitials = initials(user?.name || "U");

//   if (loading) {
//     return (
//       <div style={{ height: "100vh", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <div style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}>
//           Loading workspace…
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:wght@300;400;500&display=swap');
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         body { font-family: 'DM Sans', sans-serif; background: #0a0a0a; }

//         .dash-root {
//           display: flex; height: 100vh; overflow: hidden;
//           background: #0d0d0d; font-family: 'DM Sans', sans-serif;
//         }

//         /* ── Sidebar ── */
//         .sidebar {
//           width: 248px; min-width: 248px;
//           background: #111111;
//           border-right: 1px solid rgba(255,255,255,0.05);
//           display: flex; flex-direction: column;
//           transition: width 0.25s ease, min-width 0.25s ease;
//           overflow: hidden;
//         }
//         .sidebar.collapsed { width: 0; min-width: 0; border: none; }

//         .sidebar-header {
//           padding: 18px 16px 14px;
//           border-bottom: 1px solid rgba(255,255,255,0.05);
//           display: flex; align-items: center; justify-content: space-between;
//         }
//         .brand { display: flex; align-items: center; gap: 9px; }
//         .brand-icon {
//           width: 28px; height: 28px;
//           border: 1px solid rgba(200,165,110,0.4);
//           border-radius: 6px;
//           display: flex; align-items: center; justify-content: center;
//           flex-shrink: 0;
//         }
//         .brand-name {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 17px; font-weight: 400;
//           color: rgba(255,255,255,0.82); letter-spacing: 0.05em;
//           white-space: nowrap;
//         }

//         .sidebar-search { padding: 12px 12px 0; }
//         .search-wrap {
//           display: flex; align-items: center; gap: 8px;
//           background: rgba(255,255,255,0.04);
//           border: 1px solid rgba(255,255,255,0.07);
//           border-radius: 7px; padding: 8px 11px;
//         }
//         .search-wrap input {
//           background: none; border: none; outline: none;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 12.5px; font-weight: 300;
//           color: rgba(255,255,255,0.65); width: 100%;
//         }
//         .search-wrap input::placeholder { color: rgba(255,255,255,0.22); }

//         .sidebar-section-label {
//           padding: 16px 16px 6px;
//           font-size: 10px; font-weight: 500;
//           letter-spacing: 0.14em; text-transform: uppercase;
//           color: rgba(255,255,255,0.2);
//         }

//         .channel-item {
//           display: flex; align-items: center; gap: 9px;
//           padding: 8px 14px; cursor: pointer;
//           border-radius: 6px; margin: 1px 8px;
//           transition: background 0.15s;
//           white-space: nowrap; overflow: hidden;
//         }
//         .channel-item:hover  { background: rgba(255,255,255,0.04); }
//         .channel-item.active { background: rgba(200,165,110,0.1); }
//         .channel-hash { font-size: 14px; color: rgba(255,255,255,0.25); flex-shrink: 0; }
//         .channel-item.active .channel-hash { color: rgba(200,165,110,0.6); }
//         .channel-name {
//           font-size: 13px; font-weight: 400;
//           color: rgba(255,255,255,0.45);
//           flex: 1; overflow: hidden; text-overflow: ellipsis;
//         }
//         .channel-item.active .channel-name { color: rgba(255,255,255,0.88); }
//         .channel-badge {
//           background: rgba(200,165,110,0.2); color: rgba(200,165,110,0.9);
//           font-size: 10px; font-weight: 500;
//           padding: 2px 6px; border-radius: 10px; flex-shrink: 0;
//         }

//         .sidebar-footer {
//           margin-top: auto;
//           padding: 12px 14px;
//           border-top: 1px solid rgba(255,255,255,0.05);
//           display: flex; align-items: center; gap: 10px;
//         }
//         .user-avatar {
//           width: 30px; height: 30px; border-radius: 8px;
//           background: linear-gradient(135deg, #c8a56e, #a07040);
//           display: flex; align-items: center; justify-content: center;
//           font-size: 11px; font-weight: 500; color: #1a1208;
//           flex-shrink: 0; overflow: hidden;
//         }
//         .user-avatar img { width: 100%; height: 100%; object-fit: cover; }
//         .user-info { flex: 1; overflow: hidden; }
//         .user-name  { font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,0.75); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//         .user-status { display: flex; align-items: center; gap: 5px; font-size: 11px; color: rgba(255,255,255,0.3); }
//         .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #5dba7d; }

//         .toggle-btn {
//           background: none; border: 1px solid rgba(255,255,255,0.08);
//           border-radius: 6px; padding: 6px; cursor: pointer;
//           color: rgba(255,255,255,0.35); display: flex; align-items: center;
//           transition: all 0.15s;
//         }
//         .toggle-btn:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6); }

//         /* ── Main ── */
//         .main {
//           flex: 1; display: flex; flex-direction: column;
//           min-width: 0; background: #0d0d0d;
//         }
//         .chat-header {
//           padding: 14px 20px;
//           border-bottom: 1px solid rgba(255,255,255,0.05);
//           display: flex; align-items: center; justify-content: space-between;
//           flex-shrink: 0;
//         }
//         .chat-header-left { display: flex; align-items: center; gap: 12px; }
//         .channel-title {
//           font-size: 14px; font-weight: 500;
//           color: rgba(255,255,255,0.82); letter-spacing: 0.01em;
//         }
//         .channel-title span { color: rgba(255,255,255,0.2); margin-right: 4px; }
//         .header-actions { display: flex; gap: 8px; align-items: center; }
//         .header-btn {
//           background: none;
//           border: 1px solid rgba(255,255,255,0.1);
//           border-radius: 6px; padding: 6px 12px;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 12px; font-weight: 400;
//           color: rgba(255,255,255,0.45); cursor: pointer;
//           transition: all 0.15s;
//         }
//         .header-btn:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); }
//         .header-btn-gold { border-color: rgba(200,165,110,0.3); color: rgba(200,165,110,0.7); }
//         .header-btn-gold:hover { background: rgba(200,165,110,0.08); color: rgba(200,165,110,0.9); }

//         .messages-area {
//           flex: 1; overflow-y: auto; padding: 20px 24px;
//           display: flex; flex-direction: column; gap: 4px;
//         }
//         .messages-area::-webkit-scrollbar { width: 4px; }
//         .messages-area::-webkit-scrollbar-track { background: transparent; }
//         .messages-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

//         .empty-state {
//           flex: 1; display: flex; flex-direction: column;
//           align-items: center; justify-content: center;
//           color: rgba(255,255,255,0.15); gap: 12px;
//         }
//         .empty-state p { font-size: 13px; font-weight: 300; }

//         .msg-group {
//           display: flex; align-items: flex-start; gap: 10px;
//           padding: 6px 0; transition: opacity 0.2s;
//         }
//         .msg-group.own { flex-direction: row-reverse; }
//         .msg-group._optimistic { opacity: 0.6; }
//         .msg-avatar {
//           width: 32px; height: 32px; border-radius: 8px;
//           display: flex; align-items: center; justify-content: center;
//           font-size: 11px; font-weight: 500;
//           flex-shrink: 0; overflow: hidden;
//         }
//         .msg-avatar img { width: 100%; height: 100%; object-fit: cover; }
//         .msg-body { max-width: 68%; display: flex; flex-direction: column; gap: 3px; }
//         .msg-group.own .msg-body { align-items: flex-end; }
//         .msg-meta { display: flex; align-items: baseline; gap: 8px; }
//         .msg-group.own .msg-meta { flex-direction: row-reverse; }
//         .msg-sender { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.55); }
//         .msg-time   { font-size: 10.5px; color: rgba(255,255,255,0.2); }
//         .msg-bubble {
//           background: rgba(255,255,255,0.05);
//           border: 1px solid rgba(255,255,255,0.06);
//           border-radius: 10px; padding: 9px 13px;
//           font-size: 13.5px; line-height: 1.55;
//           color: rgba(255,255,255,0.78);
//           word-break: break-word;
//         }
//         .msg-group.own .msg-bubble {
//           background: rgba(200,165,110,0.12);
//           border-color: rgba(200,165,110,0.15);
//           color: rgba(255,255,255,0.85);
//         }

//         .input-area {
//           padding: 14px 20px 18px;
//           border-top: 1px solid rgba(255,255,255,0.05);
//           flex-shrink: 0;
//         }
//         .input-wrap {
//           display: flex; align-items: center; gap: 10px;
//           background: rgba(255,255,255,0.04);
//           border: 1px solid rgba(255,255,255,0.08);
//           border-radius: 10px; padding: 10px 14px;
//           transition: border-color 0.2s;
//         }
//         .input-wrap:focus-within { border-color: rgba(200,165,110,0.25); }
//         .input-wrap input {
//           flex: 1; background: none; border: none; outline: none;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 13.5px; font-weight: 300;
//           color: rgba(255,255,255,0.8);
//         }
//         .input-wrap input::placeholder { color: rgba(255,255,255,0.2); }
//         .send-btn {
//           background: none; border: none; cursor: pointer;
//           color: rgba(200,165,110,0.5); display: flex;
//           align-items: center; padding: 2px;
//           transition: color 0.15s;
//         }
//         .send-btn:hover:not(:disabled) { color: rgba(200,165,110,0.9); }
//         .send-btn:disabled { opacity: 0.3; cursor: default; }

//         /* ── Right Panel ── */
//         .right-panel {
//           width: 240px; min-width: 240px;
//           background: #111111;
//           border-left: 1px solid rgba(255,255,255,0.05);
//           display: flex; flex-direction: column;
//           transition: width 0.25s ease, min-width 0.25s ease;
//           overflow: hidden;
//         }
//         .right-panel.collapsed { width: 0; min-width: 0; border: none; }
//         .panel-header {
//           padding: 14px 14px 0;
//           display: flex; align-items: center; gap: 6px;
//           flex-shrink: 0;
//         }
//         .tab-btn {
//           flex: 1; background: none; border: none; cursor: pointer;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 12px; font-weight: 400;
//           color: rgba(255,255,255,0.3);
//           padding: 8px 6px; border-radius: 6px;
//           transition: all 0.15s; white-space: nowrap;
//         }
//         .tab-btn:hover  { color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.04); }
//         .tab-btn.active { color: rgba(255,255,255,0.82); background: rgba(255,255,255,0.06); }
//         .panel-body { flex: 1; overflow-y: auto; padding: 14px 12px; }
//         .panel-body::-webkit-scrollbar { width: 3px; }
//         .panel-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); }

//         .member-item {
//           display: flex; align-items: center; gap: 10px;
//           padding: 8px 6px; border-radius: 7px;
//           transition: background 0.15s; cursor: pointer;
//         }
//         .member-item:hover { background: rgba(255,255,255,0.04); }
//         .member-avatar {
//           width: 30px; height: 30px; border-radius: 8px;
//           display: flex; align-items: center; justify-content: center;
//           font-size: 11px; font-weight: 500;
//           flex-shrink: 0; overflow: hidden;
//         }
//         .member-avatar img { width: 100%; height: 100%; object-fit: cover; }
//         .member-info { flex: 1; overflow: hidden; }
//         .member-name { font-size: 12.5px; font-weight: 400; color: rgba(255,255,255,0.7); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//         .member-role { font-size: 11px; color: rgba(255,255,255,0.28); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//         .status-indicator {
//           width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
//         }
//         .status-indicator.online  { background: #5dba7d; }
//         .status-indicator.away    { background: #e8b080; }
//         .status-indicator.offline { background: rgba(255,255,255,0.15); }
//       `}</style>

//       <div className="dash-root">
//         {/* ── Sidebar ── */}
//         <div className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
//           <div className="sidebar-header">
//             <div className="brand">
//               <div className="brand-icon">
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(200,165,110,0.8)" strokeWidth="1.5">
//                   <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
//                 </svg>
//               </div>
//               <span className="brand-name">{user?.companyName || "Workspace"}</span>
//             </div>
//             <button className="toggle-btn" onClick={() => setSidebarOpen(false)}>
//               <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
//               </svg>
//             </button>
//           </div>

//           <div className="sidebar-search">
//             <div className="search-wrap">
//               <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
//                 <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
//               </svg>
//               <input placeholder="Search channels…" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} />
//             </div>
//           </div>

//           <p className="sidebar-section-label">Channels</p>
//           {filteredChannels.map((ch) => (
//             <div
//               key={ch._id}
//               className={`channel-item ${activeChannel === ch._id ? "active" : ""}`}
//               onClick={() => handleChannelClick(ch._id)}
//             >
//               <span className="channel-hash">#</span>
//               <span className="channel-name">{ch.name}</span>
//               {ch.unread > 0 && <span className="channel-badge">{ch.unread}</span>}
//             </div>
//           ))}

//           {error && (
//             <div style={{ padding: "12px 16px", fontSize: "11px", color: "#e88080" }}>{error}</div>
//           )}

//           <div className="sidebar-footer">
//             <div className="user-avatar">
//               {user?.avatar_url
//                 ? <img src={user.avatar_url} alt={user.name} />
//                 : currentUserInitials}
//             </div>
//             <div className="user-info">
//               <div className="user-name">{user?.name || "You"}</div>
//               <div className="user-status"><span className="status-dot" />Online</div>
//             </div>
//             <button className="toggle-btn" style={{ flexShrink: 0 }} title="Logout" onClick={handleLogout}>
//               <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
//                 <polyline points="16 17 21 12 16 7"/>
//                 <line x1="21" y1="12" x2="9" y2="12"/>
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* ── Main ── */}
//         <div className="main">
//           <div className="chat-header">
//             <div className="chat-header-left">
//               {!sidebarOpen && (
//                 <button className="toggle-btn" onClick={() => setSidebarOpen(true)}>
//                   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
//                   </svg>
//                 </button>
//               )}
//               <div className="channel-title">
//                 <span>#</span> {channel?.name || "…"}
//               </div>
//             </div>
//             <div className="header-actions">
//               <button className="header-btn header-btn-gold">+ Invite</button>
//               {!rightOpen && (
//                 <button className="header-btn" onClick={() => setRightOpen(true)}>Panel →</button>
//               )}
//             </div>
//           </div>

//           <div className="messages-area">
//             {msgs.length === 0 ? (
//               <div className="empty-state">
//                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
//                   <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
//                 </svg>
//                 <p>No messages yet. Start the conversation.</p>
//               </div>
//             ) : (
//               msgs.map((msg) => {
//                 const sender   = msg.senderId;
//                 const senderName = sender?.name || "Unknown";
//                 const senderInitials = initials(senderName);
//                 const isOwn    = sender?._id === user?.id || sender?._id === user?._id;
//                 const timeStr  = new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//                 return (
//                   <div key={msg._id} className={`msg-group${isOwn ? " own" : ""}${msg._optimistic ? " _optimistic" : ""}`}>
//                     <div
//                       className="msg-avatar"
//                       style={{
//                         background: isOwn
//                           ? "linear-gradient(135deg, #c8a56e, #a07040)"
//                           : `hsl(${(senderInitials.charCodeAt(0) * 37) % 360}, 35%, 30%)`,
//                         color: isOwn ? "#1a1208" : "rgba(255,255,255,0.7)",
//                       }}
//                     >
//                       {sender?.avatar_url
//                         ? <img src={sender.avatar_url} alt={senderName} />
//                         : senderInitials}
//                     </div>
//                     <div className="msg-body">
//                       <div className="msg-meta">
//                         <span className="msg-sender">{senderName}</span>
//                         <span className="msg-time">{timeStr}</span>
//                       </div>
//                       <div className="msg-bubble">{msg.content}</div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//             <div ref={bottomRef} />
//           </div>

//           <div className="input-area">
//             <div className="input-wrap">
//               <input
//                 ref={inputRef}
//                 placeholder={`Message #${channel?.name || "…"}`}
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleKey}
//                 disabled={sending}
//               />
//               <button className="send-btn" onClick={sendMessage} disabled={!input.trim() || sending}>
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <line x1="22" y1="2" x2="11" y2="13"/>
//                   <polygon points="22 2 15 22 11 13 2 9 22 2"/>
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ── Right Panel ── */}
//         <div className={`right-panel ${rightOpen ? "" : "collapsed"}`}>
//           <div className="panel-header">
//             <button className={`tab-btn ${activeTab === "members" ? "active" : ""}`} onClick={() => setActiveTab("members")}>Members</button>
//             <button className="toggle-btn" style={{ marginLeft: "auto", flexShrink: 0 }} onClick={() => setRightOpen(false)}>
//               <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
//               </svg>
//             </button>
//           </div>

//           <div className="panel-body">
//             {members.map((m) => {
//               const memberInitials = initials(m.name || "?");
//               return (
//                 <div key={m._id} className="member-item">
//                   <div
//                     className="member-avatar"
//                     style={{ background: `hsl(${(memberInitials.charCodeAt(0) * 37) % 360}, 35%, 28%)`, color: "rgba(255,255,255,0.65)" }}
//                   >
//                     {m.avatar_url
//                       ? <img src={m.avatar_url} alt={m.name} />
//                       : memberInitials}
//                   </div>
//                   <div className="member-info">
//                     <div className="member-name">{m.name}</div>
//                     <div className="member-role">{m.designation || m.role}</div>
//                   </div>
//                   <div className={`status-indicator ${m.presence?.status || "offline"}`} title={m.presence?.status} />
//                 </div>
//               );
//             })}
//             {members.length === 0 && (
//               <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: "20px" }}>
//                 No members found
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }






// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { AppProvider } from "../context/AppContext";
import { GLOBAL_CSS } from "../styles/design";
import Sidebar      from "../components/dashboard/Sidebar";
import ChatHeader   from "../components/dashboard/ChatHeader";
import ChatArea     from "../components/dashboard/ChatArea";
import MessageInput from "../components/dashboard/MessageInput";
import MembersPanel from "../components/dashboard/MemberPanel";

const layoutCss = `
.dash-root {
  display: flex; height: 100vh; overflow: hidden;
  background: #0d0d0d;
}
.dash-main {
  flex: 1; display: flex; flex-direction: column;
  min-width: 0; overflow: hidden;
}
`;

function DashboardInner() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [panelOpen,   setPanelOpen]   = useState(true);

  // Collapse sidebar on small screens
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    if (mq.matches) { setSidebarOpen(false); setPanelOpen(false); }
  }, []);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <style>{layoutCss}</style>
      <div className="dash-root">
        <Sidebar
          collapsed={!sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="dash-main">
          <ChatHeader
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((s) => !s)}
            onTogglePanel={() => setPanelOpen((s) => !s)}
          />
          <ChatArea />
          <MessageInput />
        </div>
        <MembersPanel
          collapsed={!panelOpen}
          onClose={() => setPanelOpen(false)}
        />
      </div>
    </>
  );
}

export default function Dashboard() {
  return (
    <AppProvider>
      <DashboardInner />
    </AppProvider>
  );
}