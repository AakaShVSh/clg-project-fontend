import { useState } from "react";
import { useApp } from "../context/AppContext";
import { dmAPI } from "../api/api";
import { modal, initials, avatarBg } from "../styles/design";

export default function CreateGroupDMModal({ onClose }) {
  const { companyUsers, setGroupDMs, openGroupDM } = useApp();
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const filtered = companyUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    (u.designation || "").toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (u) =>
    setSelected((prev) =>
      prev.find((s) => s._id === u._id) ? prev.filter((s) => s._id !== u._id) : [...prev, u]
    );

  const handleCreate = async () => {
    if (selected.length < 2) { setError("Select at least 2 people for a group DM"); return; }
    setLoading(true); setError("");
    try {
      const g = await dmAPI.createGroup({
        participantIds: selected.map((s) => s._id),
        name: groupName.trim() || undefined,
      });
      setGroupDMs((prev) => [g, ...prev]);
      openGroupDM(g._id);
      onClose();
    } catch (e) {
      setError(e.message || "Failed to create group DM");
    } finally { setLoading(false); }
  };

  return (
    <div style={modal.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <style>{`
        .gdm-input:focus { border-color: rgba(200,165,110,0.3) !important; }
        .gdm-user { display:flex;align-items:center;gap:10px;padding:8px;border-radius:8px;cursor:pointer;transition:background 0.12s; }
        .gdm-user:hover { background:rgba(255,255,255,0.04); }
        .gdm-avatar { width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:500;overflow:hidden;flex-shrink:0; }
        .gdm-check { width:18px;height:18px;border-radius:5px;border:1.5px solid rgba(255,255,255,0.15);margin-left:auto;flex-shrink:0;display:flex;align-items:center;justify-content:center; }
        .gdm-check.checked { background:rgba(200,165,110,0.2);border-color:rgba(200,165,110,0.5); }
        .gdm-selected-pills { display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px; }
        .gdm-pill { display:inline-flex;align-items:center;gap:5px;background:rgba(200,165,110,0.12);border:1px solid rgba(200,165,110,0.22);border-radius:20px;padding:3px 9px;font-size:12px;color:rgba(200,165,110,0.85); }
        .gdm-pill-x { background:none;border:none;cursor:pointer;color:rgba(200,165,110,0.5);font-size:14px;line-height:1;padding:0;display:flex;align-items:center; }
        .gdm-pill-x:hover{color:rgba(200,165,110,0.9);}
        .gdm-btn-p{width:100%;padding:10px;border-radius:8px;font-size:13.5px;background:rgba(200,165,110,0.14);border:1px solid rgba(200,165,110,0.28);color:rgba(200,165,110,0.9);cursor:pointer;transition:all 0.15s;margin-top:14px;font-family:'DM Sans',sans-serif;}
        .gdm-btn-p:hover:not(:disabled){background:rgba(200,165,110,0.22);}
        .gdm-btn-p:disabled{opacity:.4;cursor:default;}
      `}</style>
      <div style={modal.box}>
        <div style={modal.title}>New Group DM</div>

        {/* Selected pills */}
        {selected.length > 0 && (
          <div className="gdm-selected-pills">
            {selected.map((u) => (
              <div key={u._id} className="gdm-pill">
                {u.name}
                <button className="gdm-pill-x" onClick={() => toggle(u)}>×</button>
              </div>
            ))}
          </div>
        )}

        <input className="gdm-input" style={{ ...modal.input, marginBottom: "12px" }}
          placeholder="Search people…" value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />

        <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "14px" }}>
          {filtered.map((u) => {
            const isSelected = !!selected.find((s) => s._id === u._id);
            return (
              <div key={u._id} className="gdm-user" onClick={() => toggle(u)}>
                <div className="gdm-avatar" style={{ background: avatarBg(u.name), color: "rgba(255,255,255,0.65)" }}>
                  {u.avatar_url ? <img src={u.avatar_url} alt={u.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials(u.name)}
                </div>
                <div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.78)" }}>{u.name}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{u.designation || u.role}</div>
                </div>
                <div className={`gdm-check${isSelected ? " checked" : ""}`}>
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(200,165,110,0.9)" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginBottom: "6px" }}>
          <label style={modal.label}>Group Name <span style={{ color: "rgba(255,255,255,0.18)", fontStyle: "italic", textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
          <input className="gdm-input" style={modal.input}
            placeholder="e.g. Project Alpha team" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
        </div>

        {error && <div style={{ fontSize: "12.5px", color: "#e88080", marginTop: "10px" }}>{error}</div>}

        <button className="gdm-btn-p" onClick={handleCreate} disabled={loading || selected.length < 2}>
          {loading ? "Creating…" : `Start Group DM${selected.length > 0 ? ` (${selected.length})` : ""}`}
        </button>
      </div>
    </div>
  );
}