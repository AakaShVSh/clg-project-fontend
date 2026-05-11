// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/apiBase";
import authStyles from "../styles/AuthStyles";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{authStyles}</style>
      <div className="auth-root">
        <div className="auth-panel">

          {/* Brand */}
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#c8a56e" strokeWidth="1" fill="none"/>
                <circle cx="8" cy="8" r="2" fill="#c8a56e" opacity="0.6"/>
              </svg>
            </div>
            <span className="auth-brand-name">CTMS</span>
          </div>

          {!sent ? (
            <>
              <h1 className="auth-heading">Reset your <em>password.</em></h1>
              <p className="auth-sub">Enter your company email and we'll send a secure link</p>

              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <div className="field-group">
                  <label className="field-label" htmlFor="email">Company Email</label>
                  <input
                    id="email"
                    type="email"
                    className="field-input"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    required
                  />
                </div>

                {error && (
                  <div className="auth-error" role="alert">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="auth-btn"
                  disabled={loading || !email}
                >
                  {loading && <span className="btn-spinner" />}
                  {loading ? "Sending…" : "Send reset link"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="auth-heading">Check your <em>inbox.</em></h1>
              <p className="auth-sub">A reset link is on its way — it expires in 15 minutes</p>

              <div className="auth-form" style={{ marginTop: "8px" }}>
                <div className="auth-success">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 18 4 13"/>
                  </svg>
                  <span>
                    We sent a link to <strong style={{ color: "#c8a56e" }}>{email}</strong>.
                    If it doesn't arrive, check your spam folder.
                  </span>
                </div>

                <button
                  type="button"
                  className="auth-btn"
                  style={{ marginTop: "8px" }}
                  onClick={() => { setSent(false); setEmail(""); }}
                >
                  Try a different email
                </button>
              </div>
            </>
          )}

          <div className="auth-footer">
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">remembered it?</span>
              <div className="auth-divider-line" />
            </div>
            <div className="auth-links" style={{ justifyContent: "center" }}>
              <button className="auth-link auth-link-gold" onClick={() => navigate("/login")}>
                ← Back to sign in
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ForgotPassword;