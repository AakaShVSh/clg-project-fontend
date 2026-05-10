const BASE = import.meta.env.VITE_API_URL || "https://college-project-4t4q.onrender.com";

export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || res.statusText), { status: res.status, data });
  return data;
};

/* ── Auth ── */
export const authAPI = {
  me:     ()       => apiFetch("/auth/me"),
  logout: ()       => apiFetch("/auth/logout", { method: "POST" }),
};

/* ── Channels ── */
export const channelAPI = {
  list:          ()                    => apiFetch("/channels"),
  get:           (id)                  => apiFetch(`/channels/${id}`),
  create:        (body)                => apiFetch("/channels", { method: "POST", body: JSON.stringify(body) }),
  update:        (id, body)            => apiFetch(`/channels/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  archive:       (id)                  => apiFetch(`/channels/${id}`, { method: "DELETE" }),
  getMembers:    (id)                  => apiFetch(`/channels/${id}/members`),
  addMember:     (id, body)            => apiFetch(`/channels/${id}/members`, { method: "POST", body: JSON.stringify(body) }),
  removeMember:  (id, userId)          => apiFetch(`/channels/${id}/members/${userId}`, { method: "DELETE" }),
  getSubgroups:  (id)                  => apiFetch(`/channels/${id}/subgroups`),
  pinMessage:    (id, messageId)       => apiFetch(`/channels/${id}/pin`, { method: "POST", body: JSON.stringify({ messageId }) }),
};

/* ── Subgroups ── */
export const subgroupAPI = {
  get:          (id)       => apiFetch(`/subgroups/${id}`),
  create:       (body)     => apiFetch("/subgroups", { method: "POST", body: JSON.stringify(body) }),
  update:       (id, body) => apiFetch(`/subgroups/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  archive:      (id)       => apiFetch(`/subgroups/${id}`, { method: "DELETE" }),
  getMembers:   (id)       => apiFetch(`/subgroups/${id}/members`),
  addMember:    (id, body) => apiFetch(`/subgroups/${id}/members`, { method: "POST", body: JSON.stringify(body) }),
  removeMember: (id, uid)  => apiFetch(`/subgroups/${id}/members/${uid}`, { method: "DELETE" }),
};

/* ── Messages ── */
export const messageAPI = {
  list:    (params)       => apiFetch(`/messages?${new URLSearchParams(params)}`),
  send:    (body)         => apiFetch("/messages", { method: "POST", body: JSON.stringify(body) }),
  edit:    (id, content)  => apiFetch(`/messages/${id}`, { method: "PATCH", body: JSON.stringify({ content }) }),
  delete:  (id)           => apiFetch(`/messages/${id}`, { method: "DELETE" }),
  react:   (id, emoji)    => apiFetch(`/messages/${id}/react`, { method: "POST", body: JSON.stringify({ emoji }) }),
  markRead:(id)           => apiFetch(`/messages/${id}/read`, { method: "POST" }),
  search:  (params)       => apiFetch(`/messages/search?${new URLSearchParams(params)}`),
};

/* ── DMs ── */
export const dmAPI = {
  listDMs:     ()          => apiFetch("/dm"),
  getOrCreate: (userId)    => apiFetch("/dm", { method: "POST", body: JSON.stringify({ userId }) }),
  listGroupDMs:()          => apiFetch("/dm/groups"),
  createGroup: (body)      => apiFetch("/dm/groups", { method: "POST", body: JSON.stringify(body) }),
  getMessages: (dmId, params) => apiFetch(`/dm/${dmId}/messages?${new URLSearchParams(params)}`),
  sendMessage: (dmId, body)   => apiFetch(`/dm/${dmId}/messages`, { method: "POST", body: JSON.stringify(body) }),
};

/* ── Users ── */
export const userAPI = {
  list:    ()       => apiFetch("/users"),
  me:      ()       => apiFetch("/users/me"),
  update:  (body)   => apiFetch("/users/me", { method: "PATCH", body: JSON.stringify(body) }),
  invite:  (body)   => apiFetch("/users/invite", { method: "POST", body: JSON.stringify(body) }),
  presence:(status) => apiFetch("/users/me/presence", { method: "PATCH", body: JSON.stringify({ status }) }),
};

/* ── Tickets ── */
export const ticketAPI = {
  list:   (params) => apiFetch(`/tickets?${new URLSearchParams(params)}`),
  create: (body)   => apiFetch("/tickets", { method: "POST", body: JSON.stringify(body) }),
  update: (id, b)  => apiFetch(`/tickets/${id}`, { method: "PATCH", body: JSON.stringify(b) }),
};