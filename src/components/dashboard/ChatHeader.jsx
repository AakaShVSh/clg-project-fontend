// src/components/dashboard/ChatHeader.jsx
import { useState, useContext } from "react";
import { useApp }     from "../../context/AppContext";
import { AuthContext } from "../../context/AuthContext";
import { channelAPI, subgroupAPI } from "../../api/api";
import InviteMemberModal   from "../../modals/InviteMemberModal";
import CreateSubgroupModal from "../../modals/CreateSubgroupModal";
import { initials, avatarBg } from "../../styles/design";

const css = `
.chat-header {
  padding: 13px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex; align-items: center;
  justify-content: space-between;
  flex-shrink: 0; gap: 12px;
}
.ch-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
.ch-menu-btn {
  background: none; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px; padding: 6px; cursor: pointer;
  color: rgba(255,255,255,0.3); display: flex; align-items: center;
  transition: all 0.13s; flex-shrink: 0;
}
.ch-menu-btn:hover { color: rgba(255,255,255,0.65); background: rgba(255,255,255,0.05); }

.ch-title-group { min-width: 0; }
.ch-title {
  font-size: 14.5px; font-weight: 500;
  color: rgba(255,255,255,0.88); display: flex; align-items: center; gap: 5px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.ch-title .hash { color: rgba(255,255,255,0.22); font-size: 15px; }
.ch-desc {
  font-size: 11.5px; font-weight: 300;
  color: rgba(255,255,255,0.28);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  margin-top: 1px;
}

.ch-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

.ch-btn {
  background: none; border: 1px solid rgba(255,255,255,0.09);
  border-radius: 7px; padding: 6px 12px;
  font-size: 12px; font-weight: 400;
  color: rgba(255,255,255,0.42); cursor: pointer;
  transition: all 0.13s; display: flex; align-items: center; gap: 6px;
  white-space: nowrap;
}
.ch-btn:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.72); }
.ch-btn.gold { border-color: rgba(200,165,110,0.28); color: rgba(200,165,110,0.75); }
.ch-btn.gold:hover { background: rgba(200,165,110,0.08); color: rgba(200,165,110,0.95); }
.ch-btn.danger { border-color: rgba(220,80,80,0.25); color: rgba(220,80,80,0.55); }
.ch-btn.danger:hover { background: rgba(220,80,80,0.07); color: rgba(220,80,80,0.85); }

/* member stack */
.ch-member-stack { display: flex; align-items: center; cursor: pointer; }
.ch-member-av {
  width: 24px; height: 24px; border-radius: 7px;
  border: 2px solid #0d0d0d; margin-left: -6px;
  background: rgba(255,255,255,0.1);
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; overflow: hidden;
}
.ch-member-av:first-child { margin-left: 0; }
.ch-member-count { font-size: 11px; color: rgba(255,255,255,0.3); margin-left: 8px; white-space: nowrap; }

/* dropdown */
.ch-dropdown {
  position: absolute; top: 100%; right: 0; margin-top: 4px;
  background: #1c1c1c; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 9px; padding: 5px;
  min-width: 170px; z-index: 100;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  animation: fadeUp 0.14s ease;
}
.ch-dropdown-item {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 11px; border-radius: 6px; cursor: pointer;
  font-size: 13px; color: rgba(255,255,255,0.6);
  transition: background 0.12s;
}
.ch-dropdown-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.85); }
.ch-dropdown-item.danger { color: rgba(220,80,80,0.65); }
.ch-dropdown-item.danger:hover { background: rgba(220,80,80,0.07); color: rgba(220,80,80,0.9); }
`;

export default function ChatHeader({ onToggleSidebar, sidebarOpen, onTogglePanel }) {
  const { user } = useContext(AuthContext);
  const {
    view, activeChannel, activeSubgroup, currentMembers, activeDM, activeGroupDM,
    channels, setChannels, subgroupsByChannel, setSubgroupsByChannel,
  } = useApp();

  const [showInvite,   setShowInvite]   = useState(false);
  const [showSubgroup, setShowSubgroup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Support both id and _id shapes from AuthContext
  const userRole = user?.role;
  const isAdmin  = userRole === "admin" || userRole === "superior";

  const handleArchive = async () => {
    if (!window.confirm("Archive this channel?")) return;
    try {
      if (view === "channel" && activeChannel) {
        await channelAPI.archive(activeChannel._id);
        setChannels((prev) => prev.filter((c) => c._id !== activeChannel._id));
      } else if (view === "subgroup" && activeSubgroup) {
        await subgroupAPI.archive(activeSubgroup._id);
        setSubgroupsByChannel((prev) => ({
          ...prev,
          [activeSubgroup.channelId]: (prev[activeSubgroup.channelId] || []).filter((s) => s._id !== activeSubgroup._id),
        }));
      }
    } catch (e) { console.error(e); }
    setShowDropdown(false);
  };

  let title = "";
  let desc  = "";
  if (view === "channel"  && activeChannel)  { title = activeChannel.name;  desc = activeChannel.description; }
  if (view === "subgroup" && activeSubgroup) { title = activeSubgroup.name; desc = activeSubgroup.description; }
  if (view === "dm"       && activeDM)       { title = activeDM.otherUser?.name || "DM"; }
  if (view === "groupdm"  && activeGroupDM)  { title = activeGroupDM.name || `Group (${activeGroupDM.participants?.length})`; }

  const isChat = view === "channel" || view === "subgroup";

  return (
    <>
      <style>{css}</style>
      <div className="chat-header">
        <div className="ch-left">
          {!sidebarOpen && (
            <button className="ch-menu-btn" onClick={onToggleSidebar}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          )}
          <div className="ch-title-group">
            <div className="ch-title">
              {isChat && <span className="hash">#</span>}
              {title || "—"}
            </div>
            {desc && <div className="ch-desc">{desc}</div>}
          </div>
        </div>

        <div className="ch-right">
          {/* Member stack */}
          {isChat && currentMembers.length > 0 && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="ch-member-stack">
                {currentMembers.slice(0, 4).map((m) => (
                  <div key={m._id} className="ch-member-av" style={{ background: avatarBg(m.name), color: "rgba(255,255,255,0.65)" }}>
                    {m.avatar_url
                      ? <img src={m.avatar_url} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : initials(m.name)}
                  </div>
                ))}
              </div>
              <span className="ch-member-count">
                {currentMembers.length} member{currentMembers.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Invite */}
          {isAdmin && isChat && (
            <button className="ch-btn gold" onClick={() => setShowInvite(true)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Invite
            </button>
          )}

          {/* Add subgroup */}
          {isAdmin && view === "channel" && (
            <button className="ch-btn" onClick={() => setShowSubgroup(true)}>
              + Subgroup
            </button>
          )}

          {/* More dropdown */}
          {isAdmin && isChat && (
            <div style={{ position: "relative" }}>
              <button className="ch-btn" onClick={() => setShowDropdown((s) => !s)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="5" r="1" fill="currentColor"/>
                  <circle cx="12" cy="12" r="1" fill="currentColor"/>
                  <circle cx="12" cy="19" r="1" fill="currentColor"/>
                </svg>
              </button>
              {showDropdown && (
                <div className="ch-dropdown">
                  <div className="ch-dropdown-item danger" onClick={handleArchive}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="21 8 21 21 3 21 3 8"/>
                      <rect x="1" y="3" width="22" height="5"/>
                      <line x1="10" y1="12" x2="14" y2="12"/>
                    </svg>
                    Archive {view === "channel" ? "Channel" : "Subgroup"}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Panel toggle */}
          <button className="ch-menu-btn" title="Toggle panel" onClick={onTogglePanel}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/>
            </svg>
          </button>
        </div>
      </div>

      {showInvite   && <InviteMemberModal   onClose={() => setShowInvite(false)} />}
      {showSubgroup && <CreateSubgroupModal onClose={() => setShowSubgroup(false)} />}
    </>
  );
}