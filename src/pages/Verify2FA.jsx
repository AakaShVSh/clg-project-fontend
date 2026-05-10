// src/pages/Verify2FA.jsx
import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/apiBase";
import authStyles from "../styles/authStyles";

const OTP_LENGTH = 6;

const Verify2FA = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const inputs = useRef([]);

  const otp = digits.join("");

  const focusNext = (i) => {
    if (i < OTP_LENGTH - 1) inputs.current[i + 1]?.focus();
  };
  const focusPrev = (i) => {
    if (i > 0) inputs.current[i - 1]?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        const next = [...digits];
        next[i] = "";
        setDigits(next);
      } else {
        focusPrev(i);
      }
      return;
    }
    if (e.key === "ArrowLeft") { focusPrev(i); return; }
    if (e.key === "ArrowRight") { focusNext(i); return; }
  };

  const handleChange = (i, e) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    if (!val) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    focusNext(i);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, idx) => { next[idx] = ch; });
    setDigits(next);
    inputs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length < OTP_LENGTH) return;
    setError("");
    setLoading(true);
    try {
      const tempToken = localStorage.getItem("tempToken");
      const res = await API.post(
        "/auth/2fa/verify",
        { otp },
        { headers: { Authorization: `Bearer ${tempToken}` } }
      );
      localStorage.removeItem("tempToken");
      await login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid code. Please try again.");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      const tempToken = localStorage.getItem("tempToken");
      await API.post("/auth/2fa/resend", {}, {
        headers: { Authorization: `Bearer ${tempToken}` }
      });
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch {
      setError("Could not resend code. Please try again.");
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

          {/* Lock icon */}
          <div style={{
            width: "52px", height: "52px",
            border: "1px solid rgba(200,165,110,0.25)",
            borderRadius: "14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "24px",
            background: "rgba(200,165,110,0.06)",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8a56e" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>

          <h1 className="auth-heading">Two-factor <em>auth.</em></h1>
          <p className="auth-sub">Enter the 6-digit code from your authenticator app</p>

          <form className="auth-form" onSubmit={handleVerify} noValidate>

            {/* OTP boxes */}
            <div className="otp-grid" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="otp-cell"
                  value={d}
                  onChange={(e) => handleChange(i, e)}
                  onKeyDown={(e) => handleKey(i, e)}
                  onFocus={(e) => e.target.select()}
                  autoFocus={i === 0}
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>

            {/* Resent confirmation */}
            {resent && (
              <div className="auth-success">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 18 4 13"/>
                </svg>
                New code sent to your authenticator
              </div>
            )}

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
              disabled={otp.length < OTP_LENGTH || loading}
            >
              {loading && <span className="btn-spinner" />}
              {loading ? "Verifying…" : "Verify & sign in"}
            </button>
          </form>

          <div className="auth-footer">
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">options</span>
              <div className="auth-divider-line" />
            </div>
            <div className="auth-links">
              <button className="auth-link" onClick={handleResend}>
                Resend code
              </button>
              <button className="auth-link auth-link-gold" onClick={() => navigate("/login")}>
                ← Back to login
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Verify2FA;