// src/components/dashboard/UserProfileDrawer.jsx
// Slide-in drawer showing a user's profile info with DM + invite actions.

import { useContext } from "react";
import { useApp }     from "../../context/AppContext";
import { AuthContext } from "../../context/AuthContext";
import { initials, avatarBg, statusColor } from "../../styles/design";

const css = `
.upd-overlay {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(0,0,0,0.35);
  animation: fadeIn 0.15s ease;
}
.upd-drawer {
  position: fixed; top: 0; right: 0; bottom: 0;
  width: 300px;
  background: #131313;
  border-left: 1px solid rgba(255,255,255,0.07);
  display: flex; flex-direction: column;
  animation: slideDrawer 0.22s cubic-bezier(0.22,1,0.36,1);
  z-index: 501;
  box-shadow: -20px 0 60px rgba(0,0,0,0.5);
}
@keyframes slideDrawer {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}

/* banner */
.upd-banner {
  height: 100px;
  background: linear-gradient(135deg, rgba(200,165,110,0.18), rgba(160,112,50,0.08));
  border-bottom: 1px solid rgba(255,255,255,0.05);
  position: relative; flex-shrink: 0;
}
.upd-close {
  position: absolute; top: 12px; right: 12px;
  background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px; padding: 5px; cursor: pointer;
  color: rgba(255,255,255,0.45); display: flex; align-items: center;
  transition: all 0.13s;
}
.upd-close:hover { background: rgba(0,0,0,0.6); color: rgba(255,255,255,0.8); }

/* avatar section */
.upd-av-section {
  padding: 0 20px;
  margin-top: -36px;
  flex-shrink: 0;
}
.upd-avatar {
  width: 72px; height: 72px; border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 500;
  border: 3px solid #131313;
  overflow: hidden; position: relative;
}
.upd-avatar img { width: 100%; height: 100%; object-fit: cover; }
.upd-status-dot {
  position: absolute; bottom: 2px; right: 2px;
  width: 12px; height: 12px; border-radius: 50%;
  border: 2.5px solid #131313;
}

/* body */
.upd-body { flex: 1; overflow-y: auto; padding: 12px 20px 20px; }

.upd-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; font-weight: 400;
  color: rgba(255,255,255,0.92);
  margin-bottom: 3px; line-height: 1.2;
}
.upd-role {
  font-size: 12px; color: rgba(200,165,110,0.7);
  letter-spacing: 0.06em; text-transform: uppercase;
  margin-bottom: 16px;
}
.upd-status-row {
  display: flex; align-items: center; gap: 7px;
  font-size: 12.5px; color: rgba(255,255,255,0.35);
  margin-bottom: 20px;
}
.upd-status-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 9px; border-radius: 20px;
  font-size: 11.5px;
}

/* divider */
.upd-divider {
  height: 1px; background: rgba(255,255,255,0.06);
  margin: 16px 0;
}

/* info rows */
.upd-info-section { margin-bottom: 16px; }
.upd-info-label {
  font-size: 10px; font-weight: 500; letter-spacing: 0.13em;
  text-transform: uppercase; color: rgba(255,255,255,0.22);
  margin-bottom: 8px;
}
.upd-info-row {
  display: flex; align-items: center; gap: 9px;
  font-size: 13px; color: rgba(255,255,255,0.6);
  padding: 6px 0;
}
.upd-info-icon { color: rgba(255,255,255,0.22); flex-shrink: 0; }

/* actions */
.upd-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
.upd-btn {
  width: 100%; padding: 10px; border-radius: 8px;
  font-size: 13px; font-weight: 400;
  cursor: pointer; transition: all 0.15s;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  font-family: 'DM Sans', sans-serif;
}
.upd-btn-primary {
  background: rgba(200,165,110,0.12);
  border: 1px solid rgba(200,165,110,0.28);
  color: rgba(200,165,110,0.9);
}
.upd-btn-primary:hover { background: rgba(200,165,110,0.2); }
.upd-btn-ghost {
  background: none;
  border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.45);
}
.upd-btn-ghost:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.75); }
`;

const statusLabel = (s) =>
  s === "online" ? "Online" : s === "away" ? "Away" : "Offline";

export default function UserProfileDrawer({ member, onClose }) {
  const { openDM }   = useApp();
  const { user }     = useContext(AuthContext);
  const isSelf       = member._id === (user?.id || user?._id);
  const nm           = member.name || "Unknown";
  const presenceStatus = member.presence?.status || "offline";

  const handleDM = () => {
    openDM(member._id);
    onClose();
  };

  return (
    <>
      <style>{css}</style>
      {/* Click overlay to close */}
      <div className="upd-overlay" onClick={onClose} />

      <div className="upd-drawer">
        {/* Banner */}
        <div className="upd-banner">
          <button className="upd-close" onClick={onClose}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Avatar */}
        <div className="upd-av-section">
          <div className="upd-avatar" style={{ background: avatarBg(nm), color: "rgba(255,255,255,0.75)" }}>
            {member.avatar_url ? <img src={member.avatar_url} alt={nm} /> : initials(nm)}
            <div className="upd-status-dot" style={{ background: statusColor(presenceStatus) }} />
          </div>
        </div>

        {/* Body */}
        <div className="upd-body">
          <div className="upd-name">{nm}{isSelf ? " (you)" : ""}</div>
          <div className="upd-role">{member.designation || member.role || "Member"}</div>

          <div className="upd-status-row">
            <span
              className="upd-status-badge"
              style={{
                background: presenceStatus === "online"
                  ? "rgba(93,186,125,0.12)"
                  : presenceStatus === "away"
                  ? "rgba(232,176,128,0.12)"
                  : "rgba(255,255,255,0.06)",
                color: statusColor(presenceStatus),
                border: `1px solid ${statusColor(presenceStatus)}44`,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor(presenceStatus), display: "inline-block" }} />
              {statusLabel(presenceStatus)}
            </span>
          </div>

          <div className="upd-divider" />

          {/* Info */}
          <div className="upd-info-section">
            <div className="upd-info-label">Contact Info</div>

            {member.email && (
              <div className="upd-info-row">
                <span className="upd-info-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                {member.email}
              </div>
            )}

            {member.phone && (
              <div className="upd-info-row">
                <span className="upd-info-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                {member.phone}
              </div>
            )}

            {member.department && (
              <div className="upd-info-row">
                <span className="upd-info-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </span>
                {member.department}
              </div>
            )}
          </div>

          {/* Role section */}
          <div className="upd-info-section">
            <div className="upd-info-label">Role</div>
            <div className="upd-info-row">
              <span className="upd-info-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <span style={{ textTransform: "capitalize" }}>{member.role || "member"}</span>
            </div>
          </div>

          <div className="upd-divider" />

          {/* Actions */}
          {!isSelf && (
            <div className="upd-actions">
              <button className="upd-btn upd-btn-primary" onClick={handleDM}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Send Direct Message
              </button>
              <button className="upd-btn upd-btn-ghost" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}