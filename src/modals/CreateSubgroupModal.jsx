import { useState } from "react";
import { useApp } from "../context/AppContext";
import { modal } from "../styles/design";

export default function CreateSubgroupModal({ onClose }) {
  const { createSubgroup, activeChannelId, openSubgroup } = useApp();
  const [name, setName]     = useState("");
  const [desc, setDesc]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Subgroup name is required"); return; }
    setLoading(true); setError("");
    try {
      const sg = await createSubgroup({ channelId: activeChannelId, name: name.trim(), description: desc.trim(), type: "custom" });
      openSubgroup(sg._id, activeChannelId);
      onClose();
    } catch (e) {
      setError(e.message || "Failed to create subgroup");
    } finally { setLoading(false); }
  };

  return (
    <div style={modal.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <style>{`
        .csm-input:focus { border-color: rgba(200,165,110,0.35) !important; }
        .csm-btn-p { flex:1;padding:10px;border-radius:8px;font-size:13.5px;background:rgba(200,165,110,0.14);border:1px solid rgba(200,165,110,0.28);color:rgba(200,165,110,0.9);cursor:pointer;transition:all 0.15s;font-family:'DM Sans',sans-serif; }
        .csm-btn-p:hover:not(:disabled){background:rgba(200,165,110,0.22);}
        .csm-btn-p:disabled{opacity:.4;cursor:default;}
        .csm-btn-c{flex:1;padding:10px;border-radius:8px;font-size:13.5px;background:none;border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.4);cursor:pointer;transition:all 0.15s;font-family:'DM Sans',sans-serif;}
        .csm-btn-c:hover{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.7);}
      `}</style>
      <div style={modal.box}>
        <div style={modal.title}>New Subgroup</div>

        <div style={{ marginBottom: "16px" }}>
          <label style={modal.label}>Name</label>
          <input className="csm-input" style={modal.input} placeholder="e.g. Design Reviews" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} autoFocus />
        </div>

        <div style={{ marginBottom: "22px" }}>
          <label style={modal.label}>Description <span style={{ color: "rgba(255,255,255,0.18)", fontStyle: "italic", textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
          <input className="csm-input" style={modal.input} placeholder="Purpose of this subgroup" value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>

        {error && <div style={{ fontSize: "12.5px", color: "#e88080", marginBottom: "14px" }}>{error}</div>}

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="csm-btn-c" onClick={onClose}>Cancel</button>
          <button className="csm-btn-p" onClick={handleSubmit} disabled={loading}>{loading ? "Creating…" : "Create Subgroup"}</button>
        </div>
      </div>
    </div>
  );
}