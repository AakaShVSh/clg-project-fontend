import { useState, useRef, useContext } from "react";
import { useApp } from "../../context/AppContext";
import { AuthContext } from "../../context/AuthContext";

const css = `
.msg-input-area {
  padding: 10px 16px 14px;
  border-top: 1px solid rgba(255,255,255,0.05);
  flex-shrink: 0;
}
.msg-input-box {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 11px; overflow: hidden;
  transition: border-color 0.2s;
}
.msg-input-box:focus-within { border-color: rgba(200,165,110,0.22); }

.msg-input-top {
  display: flex; align-items: flex-end; gap: 8px;
  padding: 10px 12px 10px;
}
.msg-textarea {
  flex: 1; background: none; border: none; outline: none; resize: none;
  font-size: 13.5px; font-weight: 300; line-height: 1.55;
  color: rgba(255,255,255,0.82); max-height: 140px;
  min-height: 22px; overflow-y: auto;
}
.msg-textarea::placeholder { color: rgba(255,255,255,0.2); }

.msg-input-actions {
  display: flex; align-items: center; gap: 2px;
  flex-shrink: 0; padding-bottom: 2px;
}
.input-icon-btn {
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.25); padding: 5px; border-radius: 6px;
  display: flex; align-items: center; transition: all 0.13s; position: relative;
}
.input-icon-btn:hover { color: rgba(255,255,255,0.65); background: rgba(255,255,255,0.05); }
.send-btn {
  background: none; border: none; cursor: pointer;
  color: rgba(200,165,110,0.4); padding: 5px; border-radius: 6px;
  display: flex; align-items: center; transition: all 0.13s;
}
.send-btn:hover:not(:disabled) { color: rgba(200,165,110,0.9); background: rgba(200,165,110,0.08); }
.send-btn:disabled { opacity: 0.25; cursor: default; }

/* emoji panel */
.emoji-panel {
  border-top: 1px solid rgba(255,255,255,0.05);
  padding: 8px 12px; display: flex; flex-wrap: wrap; gap: 4px;
  animation: fadeIn 0.12s ease;
}
.ep-emoji-btn {
  background: none; border: none; cursor: pointer;
  font-size: 18px; padding: 4px; border-radius: 6px;
  transition: background 0.12s; line-height: 1;
}
.ep-emoji-btn:hover { background: rgba(255,255,255,0.07); }

/* mention dropdown */
.mention-dropdown {
  position: absolute; bottom: 100%; left: 0; right: 0;
  background: #1c1c1c; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 9px; margin-bottom: 6px;
  overflow: hidden; box-shadow: 0 -8px 32px rgba(0,0,0,0.5);
  max-height: 200px; overflow-y: auto; z-index: 200;
}
.mention-item {
  display: flex; align-items: center; gap: 9px;
  padding: 9px 12px; cursor: pointer; transition: background 0.12s;
}
.mention-item:hover, .mention-item.selected { background: rgba(200,165,110,0.09); }
.mention-avatar {
  width: 26px; height: 26px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 500; flex-shrink: 0; overflow: hidden;
}
.mention-avatar img { width: 100%; height: 100%; object-fit: cover; }
.mention-name { font-size: 13px; color: rgba(255,255,255,0.75); }
.mention-role { font-size: 11px; color: rgba(255,255,255,0.28); margin-left: 4px; }

/* attachments preview */
.attachments-bar {
  padding: 8px 12px 0; display: flex; gap: 8px; flex-wrap: wrap;
}
.attachment-chip {
  display: flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 7px; padding: 5px 9px; font-size: 12px;
  color: rgba(255,255,255,0.55);
}
.att-remove {
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.3); padding: 0; line-height: 1;
  font-size: 14px; display: flex; align-items: center;
  transition: color 0.13s;
}
.att-remove:hover { color: rgba(220,80,80,0.8); }
`;

const EMOJIS = ["😊","👍","❤️","🔥","😂","🎉","😎","👏","✅","💡","🚀","💯","😮","🙌","👀","⚡"];

import { initials, avatarBg } from "../../styles/design";

export default function MessageInput({ placeholder }) {
  const { sendMessage, currentMembers, view, activeChannel, activeSubgroup } = useApp();
  const { user } = useContext(AuthContext);

  const [text, setText]             = useState("");
  const [showEmoji, setShowEmoji]   = useState(false);
  const [mentionQ, setMentionQ]     = useState(null); // null = closed, string = query
  const [mentionSel, setMentionSel] = useState(0);
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending]       = useState(false);
  const textareaRef = useRef(null);
  const fileRef     = useRef(null);

  const contextName = view === "channel" ? `#${activeChannel?.name || ""}` : view === "subgroup" ? `#${activeSubgroup?.name || ""}` : "message";

  /* auto-grow textarea */
  const autoGrow = (el) => {
    el.style.height = "22px";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setText(val);
    autoGrow(e.target);

    // Detect @mention
    const cursor = e.target.selectionStart;
    const before = val.slice(0, cursor);
    const match  = before.match(/@(\w*)$/);
    if (match) setMentionQ(match[1]);
    else setMentionQ(null);
  };

  const handleKeyDown = (e) => {
    if (mentionQ !== null) {
      if (e.key === "ArrowDown") { e.preventDefault(); setMentionSel((s) => s + 1); return; }
      if (e.key === "ArrowUp")   { e.preventDefault(); setMentionSel((s) => Math.max(0, s - 1)); return; }
      if (e.key === "Enter" && filteredMembers.length > 0) {
        e.preventDefault(); insertMention(filteredMembers[mentionSel % filteredMembers.length]); return;
      }
      if (e.key === "Escape") { setMentionQ(null); return; }
    }
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const filteredMembers = mentionQ === null ? [] :
    mentionQ === "" ? [{ _id: "all", name: "all", role: "Everyone" }, ...currentMembers] :
    [{ _id: "all", name: "all", role: "Everyone" }, ...currentMembers]
      .filter((m) => m.name.toLowerCase().includes(mentionQ.toLowerCase()));

  const insertMention = (member) => {
    const cursor = textareaRef.current?.selectionStart || text.length;
    const before = text.slice(0, cursor);
    const after  = text.slice(cursor);
    const replaced = before.replace(/@\w*$/, `@${member.name} `);
    setText(replaced + after);
    setMentionQ(null);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleSend = async () => {
    if (!text.trim() && attachments.length === 0) return;
    setSending(true);
    try {
      await sendMessage(text.trim());
      setText("");
      setAttachments([]);
      setShowEmoji(false);
      if (textareaRef.current) { textareaRef.current.style.height = "22px"; }
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  };

  const addEmoji = (e) => {
    setText((prev) => prev + e);
    textareaRef.current?.focus();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files.map((f) => ({ name: f.name, size: f.size, file: f }))]);
    e.target.value = "";
  };

  return (
    <>
      <style>{css}</style>
      <div className="msg-input-area">
        <div style={{ position: "relative" }}>
          {/* Mention dropdown */}
          {mentionQ !== null && filteredMembers.length > 0 && (
            <div className="mention-dropdown">
              {filteredMembers.map((m, i) => (
                <div key={m._id} className={`mention-item${mentionSel % filteredMembers.length === i ? " selected" : ""}`}
                  onMouseDown={(e) => { e.preventDefault(); insertMention(m); }}>
                  <div className="mention-avatar" style={{ background: avatarBg(m.name), color: "rgba(255,255,255,0.65)" }}>
                    {m.avatar_url ? <img src={m.avatar_url} alt={m.name} /> : initials(m.name)}
                  </div>
                  <span className="mention-name">{m.name}</span>
                  <span className="mention-role">{m.role || m.designation}</span>
                </div>
              ))}
            </div>
          )}

          <div className="msg-input-box">
            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="attachments-bar">
                {attachments.map((a, i) => (
                  <div key={i} className="attachment-chip">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    {a.name}
                    <button className="att-remove" onClick={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}>×</button>
                  </div>
                ))}
              </div>
            )}

            <div className="msg-input-top">
              <textarea
                ref={textareaRef}
                className="msg-textarea"
                placeholder={placeholder || `Message ${contextName}`}
                value={text}
                rows={1}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={sending}
              />
              <div className="msg-input-actions">
                {/* File */}
                <button className="input-icon-btn" title="Attach file" onClick={() => fileRef.current?.click()}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                </button>
                <input ref={fileRef} type="file" multiple style={{ display: "none" }} onChange={handleFileChange} />

                {/* Emoji toggle */}
                <button className="input-icon-btn" title="Emoji" onClick={() => setShowEmoji((s) => !s)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                </button>

                {/* Send */}
                <button className="send-btn" disabled={!text.trim() && attachments.length === 0} onClick={handleSend}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Emoji panel */}
            {showEmoji && (
              <div className="emoji-panel">
                {EMOJIS.map((e) => (
                  <button key={e} className="ep-emoji-btn" onMouseDown={(ev) => { ev.preventDefault(); addEmoji(e); }}>
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}