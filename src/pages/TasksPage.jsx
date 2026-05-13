import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

const API = "https://college-project-4t4q.onrender.com/api";
const token = () => localStorage.getItem("token");

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');

.tp-root {
  display: flex; flex-direction: column;
  height: 100vh; background: #0e0e0e;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: rgba(255,255,255,0.78); overflow: hidden;
}

/* ── Top bar ── */
.tp-topbar {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  flex-shrink: 0; background: #111111;
}
.tp-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px; font-weight: 400; letter-spacing: 0.04em;
  color: rgba(255,255,255,0.85); flex: 1;
}
.tp-tab-group {
  display: flex; gap: 2px;
  background: rgba(255,255,255,0.04); border-radius: 8px; padding: 3px;
}
.tp-tab {
  padding: 5px 14px; border: none; background: none; cursor: pointer;
  border-radius: 6px; font-size: 12px; font-weight: 400;
  color: rgba(255,255,255,0.35); transition: all 0.15s; white-space: nowrap;
}
.tp-tab.active {
  background: rgba(200,165,110,0.12); color: rgba(200,165,110,0.9);
}
.tp-tab:hover:not(.active) { color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.04); }

.tp-new-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 7px;
  background: rgba(200,165,110,0.12);
  border: 1px solid rgba(200,165,110,0.25);
  color: rgba(200,165,110,0.9); font-size: 12.5px;
  cursor: pointer; transition: all 0.15s; white-space: nowrap;
}
.tp-new-btn:hover { background: rgba(200,165,110,0.18); border-color: rgba(200,165,110,0.4); }

/* ── Filter bar ── */
.tp-filterbar {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  flex-shrink: 0;
}
.tp-search {
  display: flex; align-items: center; gap: 7px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 7px; padding: 6px 10px; flex: 1; max-width: 280px;
}
.tp-search input {
  background: none; border: none; outline: none;
  font-size: 12px; color: rgba(255,255,255,0.65); width: 100%;
}
.tp-search input::placeholder { color: rgba(255,255,255,0.2); }
.tp-filter-select {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 7px; padding: 6px 10px;
  font-size: 12px; color: rgba(255,255,255,0.5);
  outline: none; cursor: pointer;
}
.tp-filter-select option { background: #1a1a1a; }

/* ── Body ── */
.tp-body {
  flex: 1; overflow-y: auto; padding: 20px 24px;
}

/* ── Kanban ── */
.tp-kanban {
  display: flex; gap: 14px; height: 100%; align-items: flex-start;
}
.tp-col {
  flex: 1; min-width: 220px;
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.055);
  border-radius: 10px; overflow: hidden;
}
.tp-col-head {
  padding: 11px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex; align-items: center; gap: 8px;
}
.tp-col-dot {
  width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
}
.tp-col-name {
  font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
  text-transform: uppercase; color: rgba(255,255,255,0.35); flex: 1;
}
.tp-col-count {
  font-size: 10px; color: rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.06);
  padding: 1px 6px; border-radius: 8px;
}
.tp-col-body { padding: 10px 8px; display: flex; flex-direction: column; gap: 7px; }

/* ── Task card ── */
.tp-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px; padding: 11px 12px;
  cursor: pointer; transition: all 0.15s;
}
.tp-card:hover {
  background: rgba(255,255,255,0.065);
  border-color: rgba(255,255,255,0.12);
  transform: translateY(-1px);
}
.tp-card-title {
  font-size: 12.5px; font-weight: 400;
  color: rgba(255,255,255,0.8); margin-bottom: 8px;
  line-height: 1.45;
}
.tp-card-meta {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
}
.tp-priority {
  font-size: 10px; padding: 2px 7px; border-radius: 8px;
  font-weight: 500; letter-spacing: 0.04em;
}
.tp-priority.high   { background: rgba(239,68,68,0.12);  color: rgba(239,68,68,0.8); }
.tp-priority.medium { background: rgba(245,158,11,0.12); color: rgba(245,158,11,0.8); }
.tp-priority.low    { background: rgba(34,197,94,0.10);  color: rgba(34,197,94,0.75); }
.tp-due {
  font-size: 10px; color: rgba(255,255,255,0.28);
  display: flex; align-items: center; gap: 3px;
}
.tp-due.overdue { color: rgba(239,68,68,0.7); }
.tp-assignees {
  display: flex; gap: -3px; margin-left: auto;
}
.tp-avatar-xs {
  width: 20px; height: 20px; border-radius: 5px;
  display: flex; align-items: center; justify-content: center;
  font-size: 8px; font-weight: 500;
  border: 1.5px solid #0e0e0e;
  margin-left: -4px; first-child { margin-left: 0; }
}

/* ── List view ── */
.tp-list { display: flex; flex-direction: column; gap: 5px; }
.tp-list-row {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.055);
  border-radius: 8px; cursor: pointer; transition: all 0.13s;
}
.tp-list-row:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); }
.tp-list-title { flex: 1; font-size: 13px; color: rgba(255,255,255,0.75); }
.tp-list-status {
  font-size: 10px; padding: 2px 8px; border-radius: 8px;
  font-weight: 500; white-space: nowrap;
}
.tp-list-assignee { font-size: 11px; color: rgba(255,255,255,0.3); white-space: nowrap; }

/* ── Status colors ── */
.status-pending    { background: rgba(148,163,184,0.1); color: rgba(148,163,184,0.8); }
.status-in_progress{ background: rgba(59,130,246,0.12); color: rgba(96,165,250,0.9); }
.status-submitted  { background: rgba(168,85,247,0.12); color: rgba(192,132,252,0.9); }
.status-approved   { background: rgba(34,197,94,0.10);  color: rgba(74,222,128,0.85); }
.status-rejected   { background: rgba(239,68,68,0.12);  color: rgba(252,165,165,0.85); }

/* ── Modal ── */
.tp-overlay {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(0,0,0,0.6); backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.tp-modal {
  background: #161616;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px; width: 100%; max-width: 520px;
  max-height: 85vh; overflow-y: auto;
}
.tp-modal-head {
  padding: 18px 20px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex; align-items: center; justify-content: space-between;
}
.tp-modal-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px; font-weight: 400; color: rgba(255,255,255,0.85);
}
.tp-modal-close {
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.25); padding: 4px;
  display: flex; align-items: center; border-radius: 5px;
  transition: color 0.15s;
}
.tp-modal-close:hover { color: rgba(255,255,255,0.6); }
.tp-modal-body { padding: 18px 20px; display: flex; flex-direction: column; gap: 14px; }
.tp-field label {
  display: block; font-size: 11px; font-weight: 500;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: rgba(255,255,255,0.3); margin-bottom: 6px;
}
.tp-input, .tp-textarea, .tp-select {
  width: 100%; background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 7px; padding: 8px 11px;
  font-size: 13px; color: rgba(255,255,255,0.75);
  outline: none; transition: border-color 0.15s; box-sizing: border-box;
  font-family: inherit;
}
.tp-input:focus, .tp-textarea:focus, .tp-select:focus {
  border-color: rgba(200,165,110,0.35);
}
.tp-textarea { resize: vertical; min-height: 80px; }
.tp-select option { background: #1a1a1a; }
.tp-assignee-list { display: flex; flex-direction: column; gap: 5px; max-height: 160px; overflow-y: auto; }
.tp-assignee-opt {
  display: flex; align-items: center; gap: 9px;
  padding: 6px 8px; border-radius: 6px; cursor: pointer;
  transition: background 0.12s;
}
.tp-assignee-opt:hover { background: rgba(255,255,255,0.05); }
.tp-assignee-opt.selected { background: rgba(200,165,110,0.08); }
.tp-assignee-check {
  width: 15px; height: 15px; border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all 0.12s;
}
.tp-assignee-opt.selected .tp-assignee-check {
  background: rgba(200,165,110,0.25); border-color: rgba(200,165,110,0.5);
}
.tp-assignee-name { font-size: 12.5px; color: rgba(255,255,255,0.65); }
.tp-modal-foot {
  padding: 14px 20px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex; justify-content: flex-end; gap: 8px;
}
.tp-btn-cancel {
  padding: 8px 16px; border-radius: 7px;
  background: none; border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.4); font-size: 12.5px; cursor: pointer;
  transition: all 0.13s;
}
.tp-btn-cancel:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.65); }
.tp-btn-submit {
  padding: 8px 20px; border-radius: 7px;
  background: rgba(200,165,110,0.14);
  border: 1px solid rgba(200,165,110,0.28);
  color: rgba(200,165,110,0.9); font-size: 12.5px; cursor: pointer;
  transition: all 0.13s; font-weight: 500;
}
.tp-btn-submit:hover { background: rgba(200,165,110,0.22); }
.tp-btn-submit:disabled { opacity: 0.45; cursor: not-allowed; }

/* ── Detail modal ── */
.tp-detail-section { margin-bottom: 14px; }
.tp-detail-label {
  font-size: 10px; font-weight: 500; letter-spacing: 0.12em;
  text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 5px;
}
.tp-detail-value { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6; }
.tp-status-row { display: flex; gap: 6px; flex-wrap: wrap; }
.tp-status-btn {
  padding: 5px 12px; border-radius: 7px; font-size: 11px;
  border: 1px solid rgba(255,255,255,0.1); background: none;
  color: rgba(255,255,255,0.4); cursor: pointer; transition: all 0.13s;
}
.tp-status-btn:hover { border-color: rgba(200,165,110,0.3); color: rgba(200,165,110,0.8); }
.tp-status-btn.current { background: rgba(200,165,110,0.1); border-color: rgba(200,165,110,0.35); color: rgba(200,165,110,0.9); }
.tp-status-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.tp-comment-list { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
.tp-comment {
  padding: 9px 11px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 7px;
}
.tp-comment-author { font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.5); margin-bottom: 3px; }
.tp-comment-text { font-size: 12.5px; color: rgba(255,255,255,0.65); line-height: 1.5; }
.tp-comment-input-row { display: flex; gap: 8px; margin-top: 8px; }
.tp-comment-input-row .tp-input { flex: 1; }
.tp-btn-comment {
  padding: 8px 14px; border-radius: 7px;
  background: rgba(200,165,110,0.1);
  border: 1px solid rgba(200,165,110,0.25);
  color: rgba(200,165,110,0.85); font-size: 12px; cursor: pointer;
  transition: all 0.13s; white-space: nowrap;
}
.tp-btn-comment:hover { background: rgba(200,165,110,0.18); }

/* ── Empty ── */
.tp-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 200px;
  color: rgba(255,255,255,0.2); font-size: 13px; gap: 8px;
}

/* ── Loading ── */
.tp-loading {
  display: flex; align-items: center; justify-content: center;
  height: 200px; color: rgba(255,255,255,0.2); font-size: 13px;
}
`;

/* ── helpers ── */
const avatarColor = (name = "") => {
  const colors = ["#7c5c2e","#2e5c7c","#2e7c4f","#7c2e5c","#5c2e7c","#7c4a2e"];
  let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
};
const initials = (name = "") => name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "?";
const fmtDate  = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : null;
const isOver   = (d) => d && new Date(d) < new Date();

const STATUSES = ["pending","in_progress","submitted","approved","rejected"];
const STATUS_LABELS = { pending:"Pending", in_progress:"In Progress", submitted:"Submitted", approved:"Approved", rejected:"Rejected" };
const COL_DOTS = { pending:"#94a3b8", in_progress:"#3b82f6", submitted:"#a855f7", approved:"#22c55e", rejected:"#ef4444" };

const employeeNext = { pending:["in_progress"], in_progress:["submitted"], rejected:["in_progress"] };
const superiorNext = { submitted:["approved","rejected"] };

/* ── fetch helpers ── */
const apiFetch = (path, opts = {}) =>
  fetch(`${API}${path}`, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` }, ...opts })
    .then((r) => r.json());

export default function TasksPage() {
  const { user } = useContext(AuthContext);
  const { companyUsers = [], channels = [] } = useApp();

  const isSuperior = ["manager","admin"].includes(user?.role);

  const [tab,       setTab]       = useState("all");   // all | mine
  const [viewMode,  setViewMode]  = useState("kanban"); // kanban | list
  const [tasks,     setTasks]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [filterPri, setFilterPri] = useState("");
  const [filterCh,  setFilterCh]  = useState("");

  const [showCreate,  setShowCreate]  = useState(false);
  const [detailTask,  setDetailTask]  = useState(null);
  const [detailFull,  setDetailFull]  = useState(null);
  const [commentText, setCommentText] = useState("");

  /* ── create form state ── */
  const [form, setForm] = useState({
    title: "", description: "", priority: "medium",
    dueDate: "", channelId: "", assignees: [],
  });
  const [saving, setSaving] = useState(false);

  /* ── load tasks ── */
  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (filterPri) params.set("priority", filterPri);
      if (filterCh)  params.set("channelId", filterCh);
      if (search)    params.set("search", search);

      const endpoint = tab === "mine" ? "/tasks/my" : `/tasks?${params}`;
      const data = await apiFetch(endpoint);
      setTasks(data.tasks || []);
    } catch (_) {}
    setLoading(false);
  }, [tab, filterPri, filterCh, search]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  /* ── load task detail ── */
  const openDetail = async (task) => {
    setDetailTask(task);
    setDetailFull(null);
    setCommentText("");
    const data = await apiFetch(`/tasks/${task._id}`);
    setDetailFull(data.task || null);
  };

  /* ── create task ── */
  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({ ...form, dueDate: form.dueDate || null, channelId: form.channelId || null }),
      });
      setShowCreate(false);
      setForm({ title:"", description:"", priority:"medium", dueDate:"", channelId:"", assignees:[] });
      loadTasks();
    } catch (_) {}
    setSaving(false);
  };

  /* ── status transition ── */
  const handleStatusChange = async (taskId, newStatus) => {
    await apiFetch(`/tasks/${taskId}/status`, { method: "PATCH", body: JSON.stringify({ status: newStatus }) });
    loadTasks();
    if (detailFull?._id === taskId) {
      const data = await apiFetch(`/tasks/${taskId}`);
      setDetailFull(data.task || null);
    }
  };

  /* ── add comment ── */
  const handleComment = async () => {
    if (!commentText.trim() || !detailFull) return;
    await apiFetch(`/tasks/${detailFull._id}/comments`, {
      method: "POST", body: JSON.stringify({ content: commentText }),
    });
    setCommentText("");
    const data = await apiFetch(`/tasks/${detailFull._id}`);
    setDetailFull(data.task || null);
  };

  /* ── allowed next statuses for current user ── */
  const nextStatuses = (task) => {
    const from = task.status;
    const isAssignee = task.assignees?.some((a) => (a._id || a) === user?._id);
    let allowed = [];
    if (isSuperior && superiorNext[from]) allowed = [...allowed, ...superiorNext[from]];
    if (isAssignee && employeeNext[from]) allowed = [...allowed, ...employeeNext[from]];
    return allowed;
  };

  /* ── toggle assignee in form ── */
  const toggleAssignee = (uid) => {
    setForm((f) => ({
      ...f,
      assignees: f.assignees.includes(uid)
        ? f.assignees.filter((id) => id !== uid)
        : [...f.assignees, uid],
    }));
  };

  /* ── group by status ── */
  const byStatus = STATUSES.reduce((acc, s) => {
    acc[s] = tasks.filter((t) => t.status === s);
    return acc;
  }, {});

  /* ── Card ── */
  const TaskCard = ({ task }) => (
    <div className="tp-card" onClick={() => openDetail(task)}>
      <div className="tp-card-title">{task.title}</div>
      <div className="tp-card-meta">
        <span className={`tp-priority ${task.priority}`}>{task.priority}</span>
        {task.dueDate && (
          <span className={`tp-due${isOver(task.dueDate) && task.status !== "approved" ? " overdue" : ""}`}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {fmtDate(task.dueDate)}
          </span>
        )}
        <div className="tp-assignees">
          {(task.assignees || []).slice(0, 3).map((a) => {
            const nm = a.name || "?";
            return (
              <div key={a._id || a} className="tp-avatar-xs" style={{ background: avatarColor(nm), color: "rgba(255,255,255,0.8)" }}>
                {initials(nm)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div className="tp-root">

        {/* ── Top bar ── */}
        <div className="tp-topbar">
          <span className="tp-title">Tasks</span>
          <div className="tp-tab-group">
            <button className={`tp-tab${tab === "all"  ? " active" : ""}`} onClick={() => setTab("all")}>All Tasks</button>
            <button className={`tp-tab${tab === "mine" ? " active" : ""}`} onClick={() => setTab("mine")}>My Tasks</button>
          </div>
          <div className="tp-tab-group" style={{ marginLeft: "4px" }}>
            <button className={`tp-tab${viewMode === "kanban" ? " active" : ""}`} onClick={() => setViewMode("kanban")}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display:"inline",verticalAlign:"middle",marginRight:4 }}><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="10" rx="1"/></svg>
              Board
            </button>
            <button className={`tp-tab${viewMode === "list" ? " active" : ""}`} onClick={() => setViewMode("list")}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display:"inline",verticalAlign:"middle",marginRight:4 }}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              List
            </button>
          </div>
          <button className="tp-new-btn" onClick={() => setShowCreate(true)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Task
          </button>
        </div>

        {/* ── Filter bar ── */}
        <div className="tp-filterbar">
          <div className="tp-search">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Search tasks…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="tp-filter-select" value={filterPri} onChange={(e) => setFilterPri(e.target.value)}>
            <option value="">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          {channels.length > 0 && (
            <select className="tp-filter-select" value={filterCh} onChange={(e) => setFilterCh(e.target.value)}>
              <option value="">All channels</option>
              {channels.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          )}
        </div>

        {/* ── Body ── */}
        <div className="tp-body">
          {loading ? (
            <div className="tp-loading">Loading tasks…</div>
          ) : viewMode === "kanban" ? (
            <div className="tp-kanban">
              {STATUSES.map((s) => (
                <div key={s} className="tp-col">
                  <div className="tp-col-head">
                    <span className="tp-col-dot" style={{ background: COL_DOTS[s] }} />
                    <span className="tp-col-name">{STATUS_LABELS[s]}</span>
                    <span className="tp-col-count">{byStatus[s].length}</span>
                  </div>
                  <div className="tp-col-body">
                    {byStatus[s].length === 0
                      ? <div className="tp-empty" style={{ height: 60, fontSize: 11 }}>No tasks</div>
                      : byStatus[s].map((t) => <TaskCard key={t._id} task={t} />)
                    }
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="tp-list">
              {tasks.length === 0 && <div className="tp-empty">No tasks found</div>}
              {tasks.map((t) => (
                <div key={t._id} className="tp-list-row" onClick={() => openDetail(t)}>
                  <span className={`tp-priority ${t.priority}`}>{t.priority}</span>
                  <span className="tp-list-title">{t.title}</span>
                  <span className={`tp-list-status status-${t.status}`}>{STATUS_LABELS[t.status]}</span>
                  {t.dueDate && <span className={`tp-due${isOver(t.dueDate) && t.status !== "approved" ? " overdue" : ""}`}>{fmtDate(t.dueDate)}</span>}
                  <span className="tp-list-assignee">
                    {(t.assignees || []).map((a) => a.name || "?").join(", ") || "Unassigned"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Create Modal ── */}
      {showCreate && (
        <div className="tp-overlay" onClick={(e) => e.target.className === "tp-overlay" && setShowCreate(false)}>
          <div className="tp-modal">
            <div className="tp-modal-head">
              <span className="tp-modal-title">New Task</span>
              <button className="tp-modal-close" onClick={() => setShowCreate(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="tp-modal-body">
              <div className="tp-field">
                <label>Title *</label>
                <input className="tp-input" placeholder="Task title…" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="tp-field">
                <label>Description</label>
                <textarea className="tp-textarea" placeholder="Details…" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <div className="tp-field" style={{ flex:1 }}>
                  <label>Priority</label>
                  <select className="tp-select" value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="tp-field" style={{ flex:1 }}>
                  <label>Due Date</label>
                  <input type="date" className="tp-input" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
                </div>
              </div>
              {channels.length > 0 && (
                <div className="tp-field">
                  <label>Channel (optional)</label>
                  <select className="tp-select" value={form.channelId} onChange={(e) => setForm((f) => ({ ...f, channelId: e.target.value }))}>
                    <option value="">None</option>
                    {channels.map((c) => <option key={c._id} value={c._id}>#{c.name}</option>)}
                  </select>
                </div>
              )}
              {companyUsers.length > 0 && (
                <div className="tp-field">
                  <label>Assign To</label>
                  <div className="tp-assignee-list">
                    {companyUsers.map((u) => {
                      const sel = form.assignees.includes(u._id);
                      return (
                        <div key={u._id} className={`tp-assignee-opt${sel ? " selected" : ""}`} onClick={() => toggleAssignee(u._id)}>
                          <div className="tp-assignee-check">
                            {sel && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(200,165,110,0.9)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                          <div className="tp-avatar-xs" style={{ background: avatarColor(u.name), color:"rgba(255,255,255,0.8)", marginLeft:0 }}>{initials(u.name)}</div>
                          <span className="tp-assignee-name">{u.name} <span style={{ color:"rgba(255,255,255,0.25)", fontSize:11 }}>({u.role})</span></span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="tp-modal-foot">
              <button className="tp-btn-cancel" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="tp-btn-submit" onClick={handleCreate} disabled={saving || !form.title.trim()}>
                {saving ? "Creating…" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {detailTask && (
        <div className="tp-overlay" onClick={(e) => e.target.className === "tp-overlay" && setDetailTask(null)}>
          <div className="tp-modal" style={{ maxWidth: 560 }}>
            <div className="tp-modal-head">
              <span className="tp-modal-title">{(detailFull || detailTask).title}</span>
              <button className="tp-modal-close" onClick={() => setDetailTask(null)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="tp-modal-body">
              {!detailFull ? (
                <div className="tp-loading" style={{ height: 80 }}>Loading…</div>
              ) : (
                <>
                  {/* meta row */}
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                    <span className={`tp-priority ${detailFull.priority}`}>{detailFull.priority}</span>
                    <span className={`tp-list-status status-${detailFull.status}`}>{STATUS_LABELS[detailFull.status]}</span>
                    {detailFull.dueDate && (
                      <span className={`tp-due${isOver(detailFull.dueDate) && detailFull.status !== "approved" ? " overdue" : ""}`}>
                        Due {fmtDate(detailFull.dueDate)}
                      </span>
                    )}
                  </div>

                  {/* description */}
                  {detailFull.description && (
                    <div className="tp-detail-section">
                      <div className="tp-detail-label">Description</div>
                      <div className="tp-detail-value">{detailFull.description}</div>
                    </div>
                  )}

                  {/* assignees */}
                  <div className="tp-detail-section">
                    <div className="tp-detail-label">Assignees</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:4 }}>
                      {(detailFull.assignees || []).length === 0
                        ? <span className="tp-detail-value" style={{ color:"rgba(255,255,255,0.25)" }}>Unassigned</span>
                        : (detailFull.assignees || []).map((a) => (
                          <div key={a._id} style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 8px", background:"rgba(255,255,255,0.04)", borderRadius:6 }}>
                            <div className="tp-avatar-xs" style={{ background: avatarColor(a.name), color:"rgba(255,255,255,0.8)", marginLeft:0 }}>{initials(a.name)}</div>
                            <span style={{ fontSize:12, color:"rgba(255,255,255,0.6)" }}>{a.name}</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  {/* created by */}
                  <div className="tp-detail-section">
                    <div className="tp-detail-label">Created by</div>
                    <div className="tp-detail-value">{detailFull.createdBy?.name || "—"}</div>
                  </div>

                  {/* status transition */}
                  {nextStatuses(detailFull).length > 0 && (
                    <div className="tp-detail-section">
                      <div className="tp-detail-label">Move to</div>
                      <div className="tp-status-row">
                        {nextStatuses(detailFull).map((s) => (
                          <button key={s} className="tp-status-btn" onClick={() => handleStatusChange(detailFull._id, s)}>
                            {STATUS_LABELS[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* comments */}
                  <div className="tp-detail-section">
                    <div className="tp-detail-label">Comments ({(detailFull.comments || []).length})</div>
                    {(detailFull.comments || []).length > 0 && (
                      <div className="tp-comment-list">
                        {(detailFull.comments || []).map((c) => (
                          <div key={c._id} className="tp-comment">
                            <div className="tp-comment-author">{c.userId?.name || "User"}</div>
                            <div className="tp-comment-text">{c.content}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="tp-comment-input-row" style={{ marginTop: 10 }}>
                      <input
                        className="tp-input"
                        placeholder="Add a comment…"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleComment()}
                      />
                      <button className="tp-btn-comment" onClick={handleComment}>Post</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}