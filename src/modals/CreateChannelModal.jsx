import { useState } from "react";
import { useApp } from "../context/AppContext";
import { modal } from "../styles/design";

export default function CreateChannelModal({ onClose }) {
  const { createChannel, openChannel } = useApp();
  const [name, setName]           = useState("");
  const [desc, setDesc]           = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Channel name is required"); return; }
    setLoading(true); setError("");
    try {
      const ch = await createChannel({ name: name.trim(), description: desc.trim() });
      openChannel(ch._id);
      onClose();
    } catch (e) {
      setError(e.message || "Failed to create channel");
    } finally { setLoading(false); }
  };

  return (
    <div style={modal.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <style>{`
        .ccm-input:focus { border-color: rgba(200,165,110,0.35) !important; }
        .ccm-btn-primary {
          flex:1; padding:10px; border-radius:8px; font-size:13.5px;
          background:rgba(200,165,110,0.14); border:1px solid rgba(200,165,110,0.28);
          color:rgba(200,165,110,0.9); cursor:pointer; transition:all 0.15s;
          font-family:'DM Sans',sans-serif;
        }
        .ccm-btn-primary:hover:not(:disabled) { background:rgba(200,165,110,0.22); }
        .ccm-btn-primary:disabled { opacity:0.4; cursor:default; }
        .ccm-btn-cancel {
          flex:1; padding:10px; border-radius:8px; font-size:13.5px;
          background:none; border:1px solid rgba(255,255,255,0.08);
          color:rgba(255,255,255,0.4); cursor:pointer; transition:all 0.15s;
          font-family:'DM Sans',sans-serif;
        }
        .ccm-btn-cancel:hover { background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.7); }
      `}</style>
      <div style={modal.box}>
        <div style={modal.title}>Create Channel</div>

        <div style={{ marginBottom: "16px" }}>
          <label style={modal.label}>Channel Name</label>
          <input
            className="ccm-input"
            style={modal.input}
            placeholder="e.g. marketing, engineering…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={modal.label}>Description <span style={{ color: "rgba(255,255,255,0.18)", fontStyle: "italic", textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
          <input
            className="ccm-input"
            style={modal.input}
            placeholder="What's this channel about?"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.28)", marginBottom: "16px", lineHeight: 1.5 }}>
          Three default subgroups — <strong style={{ color: "rgba(255,255,255,0.5)" }}>General</strong>, <strong style={{ color: "rgba(255,255,255,0.5)" }}>Help</strong>, and <strong style={{ color: "rgba(255,255,255,0.5)" }}>Ticket</strong> — will be created automatically.
        </div>

        {error && <div style={{ fontSize: "12.5px", color: "#e88080", marginBottom: "14px" }}>{error}</div>}

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="ccm-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="ccm-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating…" : "Create Channel"}
          </button>
        </div>
      </div>
    </div>
  );
}