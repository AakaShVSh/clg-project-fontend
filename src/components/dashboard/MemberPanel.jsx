// src/components/dashboard/MemberPanel.jsx
import { useContext, useState } from "react";
import { useApp }     from "../../context/AppContext";
import { AuthContext } from "../../context/AuthContext";
import { initials, avatarBg, statusColor } from "../../styles/design";
import UserProfileDrawer from "./UserProfileDrawer";

const css = `
.members-panel {
  width: 236px; min-width: 236px;
  background: #111111;
  border-left: 1px solid rgba(255,255,255,0.05);
  display: flex; flex-direction: column;
  transition: width 0.25s ease, min-width 0.25s ease, opacity 0.25s ease;
  overflow: hidden;
}
.members-panel.collapsed { width: 0; min-width: 0; opacity: 0; pointer-events: none; }

.mp-header {
  padding: 14px 14px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: space-between;
  flex-shrink: 0;
}
.mp-title {
  font-size: 12px; font-weight: 500; letter-spacing: 0.1em;
  text-transform: uppercase; color: rgba(255,255,255,0.3);
}
.mp-close {
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.22); padding: 3px; border-radius: 5px;
  display: flex; align-items: center; transition: all 0.13s;
}
.mp-close:hover { color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.05); }

.mp-scroll { flex: 1; overflow-y: auto; padding: 8px 8px; }

.mp-section-label {
  font-size: 10px; font-weight: 500; letter-spacing: 0.12em;
  text-transform: uppercase; color: rgba(255,255,255,0.18);
  padding: 10px 8px 5px;
}

.mp-member {
  display: flex; align-items: center; gap: 9px;
  padding: 7px 8px; border-radius: 8px; cursor: pointer;
  transition: background 0.12s;
}
.mp-member:hover { background: rgba(255,255,255,0.04); }

.mp-av-wrap { position: relative; flex-shrink: 0; }
.mp-avatar {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 500; overflow: hidden;
}
.mp-avatar img { width: 100%; height: 100%; object-fit: cover; }
.mp-status-dot {
  position: absolute; bottom: -1px; right: -1px;
  width: 8px; height: 8px; border-radius: 50%;
  border: 2px solid #111111;
}

.mp-info { flex: 1; min-width: 0; }
.mp-name { font-size: 12.5px; font-weight: 400; color: rgba(255,255,255,0.7); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mp-role { font-size: 11px; color: rgba(255,255,255,0.27); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.mp-dm-btn {
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.2); padding: 4px; border-radius: 5px;
  display: flex; align-items: center; opacity: 0;
  transition: all 0.13s; flex-shrink: 0;
}
.mp-member:hover .mp-dm-btn { opacity: 1; }
.mp-dm-btn:hover { color: rgba(200,165,110,0.8); background: rgba(200,165,110,0.08); }
`;

export default function MembersPanel({ collapsed, onClose }) {
  const { currentMembers, companyUsers, openDM } = useApp();
  const { user } = useContext(AuthContext);
  const [selectedMember, setSelectedMember]      = useState(null);

  const members = currentMembers.length > 0 ? currentMembers : companyUsers;

  const online  = members.filter((m) => m.presence?.status === "online");
  const away    = members.filter((m) => m.presence?.status === "away");
  const offline = members.filter((m) => !m.presence?.status || m.presence?.status === "offline");

  const handleDM = (e, memberId) => {
    e.stopPropagation();
    openDM(memberId);
  };

  const Section = ({ label, list }) => list.length === 0 ? null : (
    <>
      <div className="mp-section-label">{label} — {list.length}</div>
      {list.map((m) => {
        const nm   = m.name || "Unknown";
        const self = m._id === (user?.id || user?._id);
        return (
          <div
            key={m._id}
            className="mp-member"
            onClick={() => setSelectedMember(m)}
            title="View profile"
          >
            <div className="mp-av-wrap">
              <div className="mp-avatar" style={{ background: avatarBg(nm), color: "rgba(255,255,255,0.65)" }}>
                {m.avatar_url ? <img src={m.avatar_url} alt={nm} /> : initials(nm)}
              </div>
              <div className="mp-status-dot" style={{ background: statusColor(m.presence?.status) }} />
            </div>
            <div className="mp-info">
              <div className="mp-name">{nm}{self ? " (you)" : ""}</div>
              <div className="mp-role">{m.designation || m.role}</div>
            </div>
            {!self && (
              <button
                className="mp-dm-btn"
                title="Send DM"
                onClick={(e) => handleDM(e, m._id)}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </button>
            )}
          </div>
        );
      })}
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className={`members-panel${collapsed ? " collapsed" : ""}`}>
        <div className="mp-header">
          <span className="mp-title">Members</span>
          <button className="mp-close" onClick={onClose}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="mp-scroll">
          <Section label="Online"  list={online} />
          <Section label="Away"    list={away} />
          <Section label="Offline" list={offline} />
          {members.length === 0 && (
            <div style={{ padding: "20px 8px", textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.18)" }}>
              No members yet
            </div>
          )}
        </div>
      </div>

      {/* Profile drawer */}
      {selectedMember && (
        <UserProfileDrawer
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </>
  );
}