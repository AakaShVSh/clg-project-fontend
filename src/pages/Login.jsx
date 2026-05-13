// // src/pages/Login.jsx
// import { useContext, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import API from "../api/apiBase";
// import authStyles from "../styles/Authstyles";

// const EyeIcon = ({ open }) =>
//   open ? (
//     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//       <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
//       <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
//       <line x1="1" y1="1" x2="23" y2="23"/>
//     </svg>
//   ) : (
//     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//       <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
//       <circle cx="12" cy="12" r="3"/>
//     </svg>
//   );

// const Login = () => {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const justRegistered = location.state?.registered;

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPw, setShowPw] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(""); setLoading(true);
//     try {
//       const res = await API.post("/auth/login", { email, password });
//       await login(res.data);
//       navigate("/dashboard");
//       // AuthContext should handle redirect; if 2FA needed, navigate to /verify-2fa
//     } catch (err) {
//       setError(err?.response?.data?.message || "Invalid credentials. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <style>{authStyles}</style>
//       <div className="auth-root">
//         <div className="auth-panel">

//           <div className="auth-brand">
//             <div className="auth-brand-icon">
//               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//                 <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#c8a56e" strokeWidth="1" fill="none"/>
//                 <circle cx="8" cy="8" r="2" fill="#c8a56e" opacity="0.6"/>
//               </svg>
//             </div>
//             <span className="auth-brand-name">CTMS</span>
//           </div>

//           <h1 className="auth-heading">Welcome <em>back.</em></h1>
//           <p className="auth-sub">Sign in to continue to your workspace</p>

//           {justRegistered && (
//             <div className="auth-success" style={{ marginBottom: "16px", animation: "fadeUp 0.4s both" }}>
//               <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <polyline points="20 6 9 18 4 13"/>
//               </svg>
//               Workspace created! You can now sign in.
//             </div>
//           )}

//           <form className="auth-form" onSubmit={handleSubmit} noValidate>
//             <div className="field-group">
//               <label className="field-label" htmlFor="email">Email address</label>
//               <input
//                 id="email" type="email" className="field-input"
//                 placeholder="you@company.com"
//                 value={email} onChange={(e) => setEmail(e.target.value)}
//                 autoComplete="email" autoFocus required
//               />
//             </div>

//             <div className="field-group">
//               <label className="field-label" htmlFor="password">Password</label>
//               <div className="field-wrap">
//                 <input
//                   id="password"
//                   type={showPw ? "text" : "password"}
//                   className="field-input field-input-padded"
//                   placeholder="••••••••"
//                   value={password} onChange={(e) => setPassword(e.target.value)}
//                   autoComplete="current-password" required
//                 />
//                 <button type="button" className="pw-toggle" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Hide" : "Show"}>
//                   <EyeIcon open={showPw} />
//                 </button>
//               </div>
//             </div>

//             {error && (
//               <div className="auth-error" role="alert">
//                 <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
//                 </svg>
//                 {error}
//               </div>
//             )}

//             <button type="submit" className="auth-btn" disabled={loading || !email || !password}>
//               {loading && <span className="btn-spinner" />}
//               {loading ? "Signing in…" : "Sign in"}
//             </button>
//           </form>

//           <div className="auth-footer">
//             <div className="auth-divider">
//               <div className="auth-divider-line" />
//               <span className="auth-divider-text">or</span>
//               <div className="auth-divider-line" />
//             </div>
//             <div className="auth-links">
//               <button className="auth-link" onClick={() => navigate("/forgot-password")}>Forgot password?</button>
//               <button className="auth-link auth-link-gold" onClick={() => navigate("/register")}>Create workspace →</button>
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;

// src/pages/Login.jsx
import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/apiBase";
import authStyles from "../styles/Authstyles";

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

const Login = () => {
  const { login }  = useContext(AuthContext);
  const navigate   = useNavigate();
  const location   = useLocation();
  const justRegistered = location.state?.registered;

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      const data = res.data;

      // Backend signals 2FA is required
      if (data?.require2FA || data?.twoFAPending) {
        if (data.tempToken) localStorage.setItem("tempToken", data.tempToken);
        navigate("/verify-2fa");
        return;
      }

      // Normal login — pass the full response body to AuthContext
      await login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{authStyles}</style>
      <div className="auth-root">
        <div className="auth-panel">

          <div className="auth-brand">
            <div className="auth-brand-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#c8a56e" strokeWidth="1" fill="none"/>
                <circle cx="8" cy="8" r="2" fill="#c8a56e" opacity="0.6"/>
              </svg>
            </div>
            <span className="auth-brand-name">Nexus</span>
          </div>

          <h1 className="auth-heading">Welcome <em>back.</em></h1>
          <p className="auth-sub">Sign in to continue to your workspace</p>

          {justRegistered && (
            <div className="auth-success" style={{ marginBottom: "16px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 18 4 13"/>
              </svg>
              Workspace created! You can now sign in.
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label className="field-label" htmlFor="email">Email address</label>
              <input
                id="email" type="email" className="field-input"
                placeholder="you@company.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                autoComplete="email" autoFocus required
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="password">Password</label>
              <div className="field-wrap">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  className="field-input field-input-padded"
                  placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password" required
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw((v) => !v)}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button type="submit" className="auth-btn" disabled={loading || !email || !password}>
              {loading && <span className="btn-spinner" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="auth-footer">
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">or</span>
              <div className="auth-divider-line" />
            </div>
            <div className="auth-links">
              <button className="auth-link" onClick={() => navigate("/forgot-password")}>Forgot password?</button>
              <button className="auth-link auth-link-gold" onClick={() => navigate("/register")}>Create workspace →</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;
