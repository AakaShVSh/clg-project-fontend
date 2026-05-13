import { useState, useContext } from "react";
import { useApp } from "../../context/AppContext";
import { AuthContext } from "../../context/AuthContext";
import { initials, avatarBg, statusColor } from "../../styles/design";
import CreateChannelModal from "../../modals/CreateChannelModal";
import CreateGroupDMModal from "../../modals/CreateGroupDmModal";
import { useNavigate } from "react-router-dom";

const css = `
.sidebar {
  width: 252px; min-width: 252px;
  height: 100vh;
  background: #111111;
  border-right: 1px solid rgba(255,255,255,0.05);
  display: flex; flex-direction: column;
  overflow: hidden;
  transition: width 0.25s ease, min-width 0.25s ease, opacity 0.25s ease;
}
.sidebar.collapsed { width: 0; min-width: 0; opacity: 0; pointer-events: none; }

/* header */
.sb-header {
  padding: 16px 14px 13px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex; align-items: center; gap: 10px;
  flex-shrink: 0;
}
.sb-brand-icon {
  width: 30px; height: 30px; flex-shrink: 0;
  border: 1px solid rgba(200,165,110,0.35);
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
}
.sb-brand-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 17px; font-weight: 400;
  color: rgba(255,255,255,0.8); letter-spacing: 0.06em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  flex: 1;
}
.sb-close-btn {
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.2); padding: 4px;
  display: flex; align-items: center; border-radius: 5px;
  transition: color 0.15s, background 0.15s; flex-shrink: 0;
}
.sb-close-btn:hover { color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.05); }

/* search */
.sb-search {
  margin: 10px 12px 2px;
  display: flex; align-items: center; gap: 7px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 7px; padding: 7px 10px;
}
.sb-search input {
  background: none; border: none; outline: none;
  font-size: 12.5px; font-weight: 300;
  color: rgba(255,255,255,0.65); width: 100%;
}
.sb-search input::placeholder { color: rgba(255,255,255,0.2); }

/* scroll area */
.sb-scroll {
  flex: 1; overflow-y: auto; overflow-x: hidden;
  padding-bottom: 8px;
}

/* section */
.sb-section-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 14px 4px;
}
.sb-section-label {
  font-size: 10px; font-weight: 500; letter-spacing: 0.14em;
  text-transform: uppercase; color: rgba(255,255,255,0.2);
}
.sb-add-btn {
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.22); padding: 3px;
  display: flex; align-items: center; border-radius: 4px;
  transition: color 0.15s, background 0.15s;
}
.sb-add-btn:hover { color: rgba(200,165,110,0.8); background: rgba(200,165,110,0.08); }

/* channel row */
.sb-channel {
  display: flex; align-items: center;
  padding: 7px 10px 7px 14px;
  cursor: pointer; border-radius: 7px; margin: 1px 8px;
  transition: background 0.12s; gap: 8px; position: relative;
}
.sb-channel:hover  { background: rgba(255,255,255,0.04); }
.sb-channel.active { background: rgba(200,165,110,0.09); }
.sb-ch-prefix { font-size: 14px; color: rgba(255,255,255,0.2); flex-shrink: 0; line-height: 1; }
.sb-channel.active .sb-ch-prefix { color: rgba(200,165,110,0.55); }
.sb-ch-name {
  flex: 1; font-size: 13px; font-weight: 400;
  color: rgba(255,255,255,0.42); white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
.sb-channel.active .sb-ch-name { color: rgba(255,255,255,0.88); font-weight: 500; }
.sb-badge {
  background: rgba(200,165,110,0.18); color: rgba(200,165,110,0.9);
  font-size: 10px; font-weight: 500; padding: 2px 6px;
  border-radius: 10px; flex-shrink: 0;
}
.sb-chevron {
  color: rgba(255,255,255,0.18); flex-shrink: 0;
  transition: transform 0.18s;
}
.sb-chevron.open { transform: rotate(90deg); }

/* subgroup row */
.sb-subgroup {
  display: flex; align-items: center; gap: 7px;
  padding: 6px 10px 6px 30px;
  cursor: pointer; border-radius: 6px; margin: 1px 8px;
  transition: background 0.12s;
}
.sb-subgroup:hover  { background: rgba(255,255,255,0.03); }
.sb-subgroup.active { background: rgba(200,165,110,0.07); }
.sb-sg-dot {
  width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0;
  background: rgba(255,255,255,0.15);
}
.sb-subgroup.active .sb-sg-dot { background: rgba(200,165,110,0.6); }
.sb-sg-name {
  font-size: 12.5px; font-weight: 300;
  color: rgba(255,255,255,0.35); flex: 1; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
.sb-subgroup.active .sb-sg-name { color: rgba(255,255,255,0.75); }
.sb-ticket-btn {
  font-size: 10px; padding: 2px 7px;
  border: 1px solid rgba(200,165,110,0.25);
  border-radius: 10px; background: none;
  color: rgba(200,165,110,0.65); cursor: pointer;
  transition: all 0.13s; white-space: nowrap;
}
.sb-ticket-btn:hover { background: rgba(200,165,110,0.1); color: rgba(200,165,110,0.9); }

/* DM row */
.sb-dm {
  display: flex; align-items: center; gap: 9px;
  padding: 6px 10px 6px 14px;
  cursor: pointer; border-radius: 7px; margin: 1px 8px;
  transition: background 0.12s;
}
.sb-dm:hover  { background: rgba(255,255,255,0.04); }
.sb-dm.active { background: rgba(200,165,110,0.09); }
.sb-dm-avatar {
  width: 26px; height: 26px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 500; flex-shrink: 0;
  overflow: hidden; position: relative;
}
.sb-dm-avatar img { width: 100%; height: 100%; object-fit: cover; }
.sb-dm-status {
  position: absolute; bottom: -1px; right: -1px;
  width: 7px; height: 7px; border-radius: 50%;
  border: 1.5px solid #111111;
}
.sb-dm-name {
  flex: 1; font-size: 12.5px; font-weight: 300;
  color: rgba(255,255,255,0.42); white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
.sb-dm.active .sb-dm-name { color: rgba(255,255,255,0.82); }

/* footer */
.sb-footer {
  padding: 10px 12px;
  border-top: 1px solid rgba(255,255,255,0.05);
  display: flex; align-items: center; gap: 9px;
  flex-shrink: 0;
}
.sb-user-avatar {
  width: 32px; height: 32px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 500; flex-shrink: 0; overflow: hidden;
}
.sb-user-avatar img { width: 100%; height: 100%; object-fit: cover; }
.sb-user-info { flex: 1; overflow: hidden; min-width: 0; }
.sb-user-name  { font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,0.75); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sb-user-role  { font-size: 11px; color: rgba(255,255,255,0.28); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sb-footer-btn {
  background: none; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px; padding: 6px; cursor: pointer;
  color: rgba(255,255,255,0.3); display: flex; align-items: center;
  transition: all 0.15s; flex-shrink: 0;
}
.sb-footer-btn:hover { color: rgba(255,255,255,0.65); background: rgba(255,255,255,0.05); }
`;

/* ── SVG helpers ── */
const Chevron = ({ open }) => (
  <svg className={`sb-chevron${open ? " open" : ""}`} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const Plus = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default function Sidebar({ collapsed, onClose }) {
  const { user, logout } = useContext(AuthContext);
  const {
    channels, subgroupsByChannel, dms, groupDMs, companyUsers,
    activeChannelId, activeSubgroupId, activeDMId, activeGroupDMId, view,
    openChannel, openSubgroup, openDM, openGroupDM,
    loadingChannels,
  } = useApp();
  const navigate = useNavigate();
  const [expandedChannels, setExpandedChannels] = useState({});
  const [search, setSearch]                     = useState("");
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showCreateGroupDM, setShowCreateGroupDM] = useState(false);

  const toggleExpand = (id) =>
    setExpandedChannels((prev) => ({ ...prev, [id]: !prev[id] }));

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = async () => {
    try { await fetch("https://college-project-4t4q.onrender.com/api/auth/logout", { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }); } catch (_) {}
    localStorage.removeItem("token");
    if (logout) logout();
    navigate("/login");
  };

  const userInitials = initials(user?.name);
  const userBg       = avatarBg(user?.name || "");

  return (
    <>
      <style>{css}</style>
      <div className={`sidebar${collapsed ? " collapsed" : ""}`}>

        {/* ── Header ── */}
        <div className="sb-header">
          <div className="sb-brand-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(200,165,110,0.75)" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <span className="sb-brand-name">{user?.companyName || "Workspace"}</span>
          <button className="sb-close-btn" onClick={onClose}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── Search ── */}
        <div className="sb-search">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input placeholder="Search channels, DMs…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="sb-scroll">
          {/* ── Channels ── */}
          <div className="sb-section-row">
            <span className="sb-section-label">Channels</span>
            <button className="sb-add-btn" title="Create channel" onClick={() => setShowCreateChannel(true)}>
              <Plus />
            </button>
          </div>

          {loadingChannels && (
            <div style={{ padding: "8px 16px", fontSize: "11.5px", color: "rgba(255,255,255,0.2)" }}>Loading…</div>
          )}

          {filteredChannels.map((ch) => {
            const isActive   = view === "channel" && activeChannelId === ch._id;
            const isExpanded = expandedChannels[ch._id];
            const subgroups  = subgroupsByChannel[ch._id] || [];

            return (
              <div key={ch._id}>
                <div
                  className={`sb-channel${isActive && !activeSubgroupId ? " active" : ""}`}
                  onClick={() => { openChannel(ch._id); toggleExpand(ch._id); }}
                >
                  <span className="sb-ch-prefix">#</span>
                  <span className="sb-ch-name">{ch.name}</span>
                  {ch.unread > 0 && <span className="sb-badge">{ch.unread}</span>}
                  {subgroups.length > 0 && <Chevron open={isExpanded} />}
                </div>

                {/* Subgroups */}
                {isExpanded && subgroups.map((sg) => {
                  const sgActive = view === "subgroup" && activeSubgroupId === sg._id;
                  const isTicket = sg.type === "ticket";

                  return (
                    <div
                      key={sg._id}
                      className={`sb-subgroup${sgActive ? " active" : ""}`}
                      onClick={() => openSubgroup(sg._id, ch._id)}
                    >
                      <span className="sb-sg-dot" />
                      <span className="sb-sg-name">{sg.name}</span>
                      {isTicket && (
                        <button
                          className="sb-ticket-btn"
                          onClick={(e) => { e.stopPropagation(); openSubgroup(sg._id, ch._id); }}
                        >
                          Ticket
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* ── Direct Messages ── */}
          <div className="sb-section-row" style={{ marginTop: "6px" }}>
            <span className="sb-section-label">Direct Messages</span>
            <button className="sb-add-btn" title="New group DM" onClick={() => setShowCreateGroupDM(true)}>
              <Plus />
            </button>
          </div>

          {dms.map((dm) => {
            const other = dm.otherUser || {};
            const nm    = other.name || "Unknown";
            const isActive = view === "dm" && activeDMId === dm._id;
            return (
              <div key={dm._id} className={`sb-dm${isActive ? " active" : ""}`} onClick={() => openDM(other._id || other)}>
                <div className="sb-dm-avatar" style={{ background: avatarBg(nm), color: "rgba(255,255,255,0.65)" }}>
                  {other.avatar_url ? <img src={other.avatar_url} alt={nm} /> : initials(nm)}
                  <span className="sb-dm-status" style={{ background: statusColor(other.presence?.status) }} />
                </div>
                <span className="sb-dm-name">{nm}</span>
              </div>
            );
          })}

          {/* Group DMs */}
          {groupDMs.map((g) => {
            const isActive = view === "groupdm" && activeGroupDMId === g._id;
            const label    = g.name || `Group (${g.participants?.length || 0})`;
            return (
              <div key={g._id} className={`sb-dm${isActive ? " active" : ""}`} onClick={() => openGroupDM(g._id)}>
                <div className="sb-dm-avatar" style={{ background: "rgba(200,165,110,0.15)", color: "rgba(200,165,110,0.7)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <span className="sb-dm-name">{label}</span>
              </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div className="sb-footer">
          <div className="sb-user-avatar" style={{ background: user?.avatar_url ? "transparent" : avatarBg(user?.name || ""), color: "rgba(255,255,255,0.7)" }}>
            {user?.avatar_url ? <img src={user.avatar_url} alt={user.name} /> : userInitials}
          </div>
          <div className="sb-user-info">
            <div className="sb-user-name">{user?.name || "You"}</div>
            <div className="sb-user-role">{user?.designation || user?.role || "Member"}</div>
          </div>
          <button className="sb-footer-btn" title="Sign out" onClick={handleLogout}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      {showCreateChannel && <CreateChannelModal onClose={() => setShowCreateChannel(false)} />}
      {showCreateGroupDM && <CreateGroupDMModal onClose={() => setShowCreateGroupDM(false)} />}
    </>
  );
}
