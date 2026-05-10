/* ── Design tokens ── */
export const tokens = {
  gold:    "rgba(200,165,110,1)",
  goldDim: "rgba(200,165,110,0.55)",
  goldFaint:"rgba(200,165,110,0.12)",
  goldBorder:"rgba(200,165,110,0.22)",
  bg:      "#0d0d0d",
  surface: "#111111",
  surface2:"#161616",
  border:  "rgba(255,255,255,0.06)",
  border2: "rgba(255,255,255,0.1)",
  text:    "rgba(255,255,255,0.82)",
  textDim: "rgba(255,255,255,0.45)",
  textFaint:"rgba(255,255,255,0.22)",
  online:  "#5dba7d",
  away:    "#e8b080",
  offline: "rgba(255,255,255,0.18)",
};

/* ── Shared CSS injected once at app root ── */
export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body {
    font-family: 'DM Sans', sans-serif;
    background: #0d0d0d;
    color: rgba(255,255,255,0.82);
    -webkit-font-smoothing: antialiased;
  }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }

  button { font-family: 'DM Sans', sans-serif; }
  input, textarea { font-family: 'DM Sans', sans-serif; }

  /* Utility */
  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .serif { font-family: 'Cormorant Garamond', serif; }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .fade-up  { animation: fadeUp  0.2s ease both; }
  .fade-in  { animation: fadeIn  0.18s ease both; }
  .slide-in { animation: slideIn 0.18s ease both; }
`;

/* ── Reusable component styles as JS objects ── */
export const btn = {
  base: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    background: "none", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "7px", padding: "7px 13px",
    fontSize: "12.5px", fontWeight: 400,
    color: "rgba(255,255,255,0.5)", cursor: "pointer",
    transition: "all 0.15s", whiteSpace: "nowrap",
    fontFamily: "'DM Sans', sans-serif",
  },
  gold: {
    borderColor: "rgba(200,165,110,0.3)",
    color: "rgba(200,165,110,0.8)",
  },
  ghost: {
    border: "none", padding: "6px 8px",
    borderRadius: "6px",
    color: "rgba(255,255,255,0.3)",
  },
  icon: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    background: "none", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "6px", padding: "6px",
    cursor: "pointer", color: "rgba(255,255,255,0.3)",
    transition: "all 0.15s",
  },
};

export const modal = {
  overlay: {
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(0,0,0,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(4px)",
    animation: "fadeIn 0.15s ease",
  },
  box: {
    background: "#161616",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "28px",
    width: "420px", maxWidth: "calc(100vw - 40px)",
    animation: "fadeUp 0.18s ease",
    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "22px", fontWeight: 400,
    color: "rgba(255,255,255,0.88)",
    marginBottom: "20px",
    letterSpacing: "0.02em",
  },
  label: {
    display: "block",
    fontSize: "11px", fontWeight: 500,
    letterSpacing: "0.1em", textTransform: "uppercase",
    color: "rgba(255,255,255,0.28)",
    marginBottom: "7px",
  },
  input: {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px", padding: "10px 13px",
    fontSize: "13.5px", fontWeight: 300,
    color: "rgba(255,255,255,0.82)",
    outline: "none", transition: "border-color 0.15s",
    fontFamily: "'DM Sans', sans-serif",
  },
};

/* ── Status color helper ── */
export const statusColor = (s) =>
  s === "online" ? "#5dba7d" : s === "away" ? "#e8b080" : "rgba(255,255,255,0.18)";

/* ── Initials helper ── */
export const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";

/* ── Avatar background ── */
export const avatarBg = (str = "") =>
  `hsl(${(str.charCodeAt(0) * 47 + str.charCodeAt(1) * 17) % 360}, 32%, 28%)`;