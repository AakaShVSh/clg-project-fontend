// src/components/dashboard/ChatArea.jsx
import { useEffect, useRef, useState, useContext } from "react";
import { useApp }      from "../../context/AppContext";
import { AuthContext } from "../../context/AuthContext";
import { messageAPI }  from "../../api/api";
import { initials, avatarBg } from "../../styles/design";

const css = `
.chat-area {
  flex: 1; display: flex; flex-direction: column;
  min-width: 0; min-height: 0; overflow: hidden;
}
.messages-scroll {
  flex: 1; overflow-y: auto; overflow-x: hidden;
  padding: 16px 20px 8px;
  display: flex; flex-direction: column;
  gap: 2px;
}

/* date divider */
.date-divider {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 0 6px;
}
.date-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
.date-divider-label {
  font-size: 11px; color: rgba(255,255,255,0.2);
  white-space: nowrap; letter-spacing: 0.04em;
}

/* message group */
.msg-wrap {
  display: flex; align-items: flex-start; gap: 9px;
  padding: 4px 0; border-radius: 8px;
  transition: background 0.12s; position: relative;
}
.msg-wrap:hover { background: rgba(255,255,255,0.02); }
.msg-wrap:hover .msg-actions { opacity: 1; }
.msg-wrap.own { flex-direction: row-reverse; }
.msg-wrap.optimistic { opacity: 0.55; }

.msg-avatar {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 500; flex-shrink: 0;
  overflow: hidden; margin-top: 2px;
}
.msg-avatar img { width: 100%; height: 100%; object-fit: cover; }

.msg-body { max-width: 70%; display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.msg-wrap.own .msg-body { align-items: flex-end; }

.msg-meta { display: flex; align-items: baseline; gap: 8px; }
.msg-wrap.own .msg-meta { flex-direction: row-reverse; }
.msg-sender { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); }
.msg-time   { font-size: 10.5px; color: rgba(255,255,255,0.2); }
.msg-edited { font-size: 10px; color: rgba(255,255,255,0.18); font-style: italic; }

.msg-bubble {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px; padding: 9px 13px;
  font-size: 13.5px; line-height: 1.6;
  color: rgba(255,255,255,0.8); word-break: break-word;
  white-space: pre-wrap;
}
.msg-wrap.own .msg-bubble {
  background: rgba(200,165,110,0.11);
  border-color: rgba(200,165,110,0.14);
}
.msg-bubble.deleted {
  background: transparent;
  border-color: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.2);
  font-style: italic; font-size: 12.5px;
}

/* reactions */
.msg-reactions { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 3px; }
.reaction-pill {
  display: inline-flex; align-items: center; gap: 4px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px; padding: 2px 8px;
  font-size: 12px; cursor: pointer; transition: all 0.13s;
  color: rgba(255,255,255,0.55);
}
.reaction-pill:hover { background: rgba(255,255,255,0.09); }
.reaction-pill.mine  { background: rgba(200,165,110,0.12); border-color: rgba(200,165,110,0.25); color: rgba(200,165,110,0.8); }
.reaction-count { font-size: 11px; font-weight: 500; }

/* read receipts */
.msg-read-stack { display: flex; margin-top: 3px; }
.msg-wrap.own .msg-read-stack { justify-content: flex-end; }
.read-avatar {
  width: 14px; height: 14px; border-radius: 4px;
  border: 1.5px solid #0d0d0d; margin-left: -3px;
  background: rgba(255,255,255,0.1);
  display: flex; align-items: center; justify-content: center;
  font-size: 7px; overflow: hidden;
}
.read-avatar:first-child { margin-left: 0; }

/* action bar */
.msg-actions {
  position: absolute; top: 2px; right: 8px;
  display: flex; align-items: center; gap: 2px;
  background: #1a1a1a; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px; padding: 3px 5px; opacity: 0; transition: opacity 0.15s;
  z-index: 10;
}
.msg-wrap.own .msg-actions { left: 8px; right: auto; }
.msg-action-btn {
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.3); padding: 4px; border-radius: 5px;
  display: flex; align-items: center; transition: all 0.13s;
  font-size: 13px;
}
.msg-action-btn:hover { color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.05); }

/* emoji picker */
.emoji-picker {
  position: absolute; top: 36px; right: 8px;
  background: #1c1c1c; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px; padding: 8px;
  display: flex; gap: 5px; flex-wrap: wrap; z-index: 100;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  width: 200px;
}
.msg-wrap.own .emoji-picker { left: 8px; right: auto; }
.emoji-btn {
  background: none; border: none; cursor: pointer;
  font-size: 18px; padding: 4px; border-radius: 6px;
  transition: background 0.12s; line-height: 1;
}
.emoji-btn:hover { background: rgba(255,255,255,0.08); }

/* edit input */
.msg-edit-input {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(200,165,110,0.3);
  border-radius: 9px; padding: 9px 13px;
  font-size: 13.5px; line-height: 1.6;
  color: rgba(255,255,255,0.85); width: 100%;
  outline: none; resize: none; font-family: 'DM Sans', sans-serif;
}
.msg-edit-actions { display: flex; gap: 6px; margin-top: 5px; justify-content: flex-end; }
.msg-edit-save {
  background: rgba(200,165,110,0.15); border: 1px solid rgba(200,165,110,0.3);
  border-radius: 6px; padding: 5px 12px; font-size: 12px;
  color: rgba(200,165,110,0.9); cursor: pointer; transition: all 0.13s;
}
.msg-edit-save:hover { background: rgba(200,165,110,0.25); }
.msg-edit-cancel {
  background: none; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px; padding: 5px 12px; font-size: 12px;
  color: rgba(255,255,255,0.4); cursor: pointer; transition: all 0.13s;
}
.msg-edit-cancel:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); }

/* empty */
.chat-empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  color: rgba(255,255,255,0.15); gap: 12px;
}
.chat-empty-icon { opacity: 0.3; }
.chat-empty p { font-size: 13px; font-weight: 300; }
`;

const QUICK_EMOJIS = ["👍","❤️","😂","😮","😢","🔥","✅","👀"];

const fmt = (d) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const fmtDate = (d) => {
  const now  = new Date();
  const date = new Date(d);
  if (date.toDateString() === now.toDateString()) return "Today";
  const y = new Date(now); y.setDate(y.getDate() - 1);
  if (date.toDateString() === y.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { month: "long", day: "numeric" });
};

function MessageBubble({ msg, userId, onReact, onDelete }) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [editing,   setEditing]   = useState(false);
  const [editText,  setEditText]  = useState(msg.content);

  // Support both populated senderId object and raw string id
  const senderId   = typeof msg.senderId === "object" ? msg.senderId?._id : msg.senderId;
  const isOwn      = senderId === userId;
  const isDeleted  = msg.isDeleted;
  const sender     = typeof msg.senderId === "object" ? (msg.senderId || {}) : {};
  const senderName = sender.name || "Unknown";

  const saveEdit = async () => {
    if (!editText.trim()) return;
    try {
      await messageAPI.edit(msg._id, editText.trim());
      msg.content  = editText.trim();
      msg.isEdited = true;
      setEditing(false);
    } catch (e) { console.error(e); }
  };

  return (
    <div className={`msg-wrap${isOwn ? " own" : ""}${msg._optimistic ? " optimistic" : ""}`}>
      <div
        className="msg-avatar"
        style={{
          background: isOwn
            ? "linear-gradient(135deg,#c8a56e,#a07040)"
            : avatarBg(senderName),
          color: isOwn ? "#1a1208" : "rgba(255,255,255,0.7)",
        }}
      >
        {sender.avatar_url
          ? <img src={sender.avatar_url} alt={senderName} />
          : initials(senderName)}
      </div>

      <div className="msg-body">
        <div className="msg-meta">
          <span className="msg-sender">{senderName}</span>
          <span className="msg-time">{fmt(msg.createdAt)}</span>
          {msg.isEdited && <span className="msg-edited">(edited)</span>}
        </div>

        {editing ? (
          <>
            <textarea
              className="msg-edit-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveEdit(); }
                if (e.key === "Escape") setEditing(false);
              }}
            />
            <div className="msg-edit-actions">
              <button className="msg-edit-cancel" onClick={() => setEditing(false)}>Cancel</button>
              <button className="msg-edit-save"   onClick={saveEdit}>Save</button>
            </div>
          </>
        ) : (
          <div className={`msg-bubble${isDeleted ? " deleted" : ""}`}>
            {isDeleted ? "This message was deleted." : msg.content}
          </div>
        )}

        {/* Reactions */}
        {!isDeleted && msg.reactions?.length > 0 && (
          <div className="msg-reactions">
            {msg.reactions.map((r) => {
              const mine = r.userIds?.includes(userId);
              return (
                <button key={r.emoji} className={`reaction-pill${mine ? " mine" : ""}`} onClick={() => onReact(msg._id, r.emoji)}>
                  {r.emoji} <span className="reaction-count">{r.userIds?.length || 0}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Read receipts */}
        {isOwn && !isDeleted && msg.readBy?.length > 0 && (
          <div className="msg-read-stack">
            {msg.readBy.slice(0, 5).map((r, i) => (
              <div key={i} className="read-avatar" title={r.userId?.name || "read"} style={{ background: avatarBg(r.userId?.name || "") }}>
                {initials(r.userId?.name || "?")}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hover action bar */}
      {!isDeleted && !editing && !msg._optimistic && (
        <div className="msg-actions">
          <div style={{ position: "relative" }}>
            <button className="msg-action-btn" title="React" onClick={() => setShowEmoji((s) => !s)}>😊</button>
            {showEmoji && (
              <div className="emoji-picker">
                {QUICK_EMOJIS.map((e) => (
                  <button key={e} className="emoji-btn" onClick={() => { onReact(msg._id, e); setShowEmoji(false); }}>{e}</button>
                ))}
              </div>
            )}
          </div>
          {isOwn && (
            <button className="msg-action-btn" title="Edit" onClick={() => { setEditing(true); setShowEmoji(false); }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          )}
          {isOwn && (
            <button
              className="msg-action-btn"
              title="Delete"
              style={{ color: "rgba(220,80,80,0.5)" }}
              onClick={() => { if (window.confirm("Delete this message?")) onDelete(msg._id); }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ChatArea() {
  const { user }          = useContext(AuthContext);
  const { currentMessages } = useApp();
  const bottomRef         = useRef(null);
  const [localMsgs, setLocalMsgs] = useState([]);

  // Normalise user id: backend may return id or _id
  const userId = user?.id || user?._id;

  useEffect(() => { setLocalMsgs(currentMessages); }, [currentMessages]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [localMsgs.length]);

  const handleReact = async (msgId, emoji) => {
    try {
      const reactions = await messageAPI.react(msgId, emoji);
      setLocalMsgs((prev) => prev.map((m) => m._id === msgId ? { ...m, reactions } : m));
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (msgId) => {
    try {
      await messageAPI.delete(msgId);
      setLocalMsgs((prev) => prev.map((m) => m._id === msgId ? { ...m, isDeleted: true, content: "" } : m));
    } catch (e) { console.error(e); }
  };

  /* group by date */
  const grouped = [];
  let lastDate  = null;
  localMsgs.forEach((msg) => {
    const d = fmtDate(msg.createdAt);
    if (d !== lastDate) { grouped.push({ type: "date", label: d }); lastDate = d; }
    grouped.push({ type: "msg", msg });
  });

  if (localMsgs.length === 0) {
    return (
      <>
        <style>{css}</style>
        <div className="chat-area">
          <div className="messages-scroll">
            <div className="chat-empty">
              <svg className="chat-empty-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p>No messages yet — start the conversation.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="chat-area">
        <div className="messages-scroll">
          {grouped.map((item, i) =>
            item.type === "date" ? (
              <div key={`date-${i}`} className="date-divider">
                <div className="date-divider-line" />
                <span className="date-divider-label">{item.label}</span>
                <div className="date-divider-line" />
              </div>
            ) : (
              <MessageBubble
                key={item.msg._id}
                msg={item.msg}
                userId={userId}
                onReact={handleReact}
                onDelete={handleDelete}
              />
            )
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </>
  );
}