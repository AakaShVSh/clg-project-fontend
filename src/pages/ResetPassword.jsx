// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/apiBase";
import authStyles from "../styles/AuthStyles";

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["", "#e88080", "#e8b080", "#8ab4e8", "#6dd49a"];

const ResetPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const pwStrength = getStrength(password);
  const mismatch = confirm && password !== confirm;
  const canSubmit = password.length >= 8 && password === confirm && !!token;

  const handleReset = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/reset-password", { token, newPassword: password });
      setDone(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
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
              <span className="auth-brand-name">CTMS</span>
            </div>
            <h1 className="auth-heading">Invalid <em>link.</em></h1>
            <p className="auth-sub" style={{ marginBottom: "24px" }}>
              This reset link is missing or invalid. Please request a new one.
            </p>
            <button className="auth-btn" style={{ marginTop: 0 }} onClick={() => navigate("/forgot-password")}>
              Request new link
            </button>
          </div>
        </div>
      </>
    );
  }

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
            <span className="auth-brand-name">CTMS</span>
          </div>

          {!done ? (
            <>
              <h1 className="auth-heading">New <em>password.</em></h1>
              <p className="auth-sub">Choose something strong — at least 8 characters</p>

              <form className="auth-form" onSubmit={handleReset} noValidate>
                <div className="field-group">
                  <label className="field-label">New Password</label>
                  <div className="field-wrap">
                    <input
                      type={showPw ? "text" : "password"}
                      className="field-input field-input-padded"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoFocus
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)}>
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                  {password && (
                    <div className="pw-strength">
                      {[1,2,3,4].map(n => (
                        <div
                          key={n}
                          className="pw-strength-bar"
                          style={{ background: n <= pwStrength ? strengthColors[pwStrength] : undefined }}
                        />
                      ))}
                      <span className="pw-strength-label" style={{ color: strengthColors[pwStrength] }}>
                        {strengthLabels[pwStrength]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="field-group">
                  <label className="field-label">Confirm Password</label>
                  <div className="field-wrap">
                    <input
                      type={showConfirm ? "text" : "password"}
                      className={`field-input field-input-padded`}
                      style={mismatch ? { borderColor: "rgba(220,80,80,0.45)" } : {}}
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowConfirm(v => !v)}>
                      <EyeIcon open={showConfirm} />
                    </button>
                  </div>
                  {mismatch && (
                    <p style={{ fontSize: "12px", color: "#e88080", marginTop: "5px", fontWeight: 300 }}>
                      Passwords don't match
                    </p>
                  )}
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

                <button type="submit" className="auth-btn" disabled={!canSubmit || loading}>
                  {loading && <span className="btn-spinner" />}
                  {loading ? "Updating…" : "Update password"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="auth-heading">All <em>done.</em></h1>
              <p className="auth-sub">Your password has been updated successfully</p>
              <div className="auth-form" style={{ marginTop: "8px" }}>
                <div className="auth-success">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 18 4 13"/>
                  </svg>
                  Password changed. You can now sign in with your new credentials.
                </div>
                <button className="auth-btn" style={{ marginTop: "8px" }} onClick={() => navigate("/login")}>
                  Go to sign in →
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default ResetPassword;