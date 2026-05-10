import { useState } from "react";
import { useApp } from "../context/AppContext";
import { channelAPI, subgroupAPI } from "../api/api";
import { modal, initials, avatarBg } from "../styles/design";

export default function InviteMemberModal({ onClose }) {
  const { companyUsers, activeChannelId, activeSubgroupId, view, currentMembers, loadMembers } = useApp();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState({});
  const [added, setAdded]   = useState({});
  const [error, setError]   = useState("");

  const existingIds = new Set(currentMembers.map((m) => m._id?.toString()));

  const filtered = companyUsers.filter((u) =>
    !existingIds.has(u._id?.toString()) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = async (userId) => {
    setLoading((prev) => ({ ...prev, [userId]: true }));
    setError("");
    try {
      if (view === "subgroup" && activeSubgroupId) {
        await subgroupAPI.addMember(activeSubgroupId, { userId });
      } else {
        await channelAPI.addMember(activeChannelId, { userId });
      }
      setAdded((prev) => ({ ...prev, [userId]: true }));
      loadMembers(activeChannelId);
    } catch (e) {
      setError(e.message || "Failed to add member");
    } finally {
      setLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div style={modal.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <style>{`
        .im-search:focus { border-color: rgba(200,165,110,0.3) !important; }
        .im-user-row { display:flex;align-items:center;gap:10px;padding:9px 8px;border-radius:8px;transition:background 0.12s; }
        .im-user-row:hover { background:rgba(255,255,255,0.04); }
        .im-avatar { width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:500;overflow:hidden;flex-shrink:0; }
        .im-avatar img { width:100%;height:100%;object-fit:cover; }
        .im-add-btn { margin-left:auto;padding:5px 13px;border-radius:7px;font-size:12px;border:1px solid rgba(200,165,110,0.28);background:rgba(200,165,110,0.1);color:rgba(200,165,110,0.85);cursor:pointer;transition:all 0.13s;font-family:'DM Sans',sans-serif;flex-shrink:0; }
        .im-add-btn:hover:not(:disabled){background:rgba(200,165,110,0.2);}
        .im-add-btn:disabled{opacity:.4;cursor:default;}
        .im-added-btn { margin-left:auto;padding:5px 13px;border-radius:7px;font-size:12px;border:1px solid rgba(93,186,125,0.28);background:rgba(93,186,125,0.08);color:rgba(93,186,125,0.7);flex-shrink:0; }
        .im-close-btn { width:100%;padding:10px;border-radius:8px;font-size:13.5px;background:none;border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.45);cursor:pointer;transition:all 0.15s;margin-top:14px;font-family:'DM Sans',sans-serif; }
        .im-close-btn:hover{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.7);}
      `}</style>
      <div style={modal.box}>
        <div style={modal.title}>Invite Members</div>

        <input
          className="im-search"
          style={{ ...modal.input, marginBottom: "14px" }}
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />

        <div style={{ maxHeight: "260px", overflowY: "auto", margin: "0 -4px" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", fontSize: "12.5px", color: "rgba(255,255,255,0.22)" }}>
              {search ? "No users match that search" : "All company members are already in this channel"}
            </div>
          ) : filtered.map((u) => (
            <div key={u._id} className="im-user-row">
              <div className="im-avatar" style={{ background: avatarBg(u.name), color: "rgba(255,255,255,0.65)" }}>
                {u.avatar_url ? <img src={u.avatar_url} alt={u.name} /> : initials(u.name)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: 400, color: "rgba(255,255,255,0.75)" }}>{u.name}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)" }}>{u.designation || u.role}</div>
              </div>
              {added[u._id] ? (
                <div className="im-added-btn">✓ Added</div>
              ) : (
                <button className="im-add-btn" disabled={loading[u._id]} onClick={() => handleAdd(u._id)}>
                  {loading[u._id] ? "…" : "Add"}
                </button>
              )}
            </div>
          ))}
        </div>

        {error && <div style={{ fontSize: "12.5px", color: "#e88080", marginTop: "10px" }}>{error}</div>}

        <button className="im-close-btn" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}