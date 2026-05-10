// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/apiBase";
import authStyles from "../styles/authStyles";

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

const STEPS = [
  { title: "Company", subtitle: "Tell us about your organization" },
  { title: "Location", subtitle: "Where are you based?" },
  { title: "Account", subtitle: "Set up your workspace credentials" },
];

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    companyName: "", companyEmail: "", address: "", pincode: "",
    state: "", country: "", userName: "", password: "", channelName: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pwStrength = getStrength(form.password);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validateStep = () => {
    if (step === 0 && (!form.companyName || !form.companyEmail)) return "Company name and email are required.";
    if (step === 1 && (!form.address || !form.pincode || !form.state || !form.country)) return "All location fields are required.";
    if (step === 2 && (!form.userName || !form.password || !form.channelName)) return "All account fields are required.";
    if (step === 2 && form.password.length < 8) return "Password must be at least 8 characters.";
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep();
    if (err) { setError(err); return; }
    setError(""); setLoading(true);
    try {
      await API.post("/auth/register", form);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{authStyles}</style>
      <style>{`
        .step-track { display:flex; gap:6px; margin-bottom:36px; animation: fadeUp 0.55s 0.06s cubic-bezier(0.22,1,0.36,1) both; }
        .step-dot {
          flex:1; height:2px; border-radius:2px;
          background: rgba(255,255,255,0.1);
          transition: background 0.4s;
        }
        .step-dot.active { background: #c8a56e; }
        .step-dot.done { background: rgba(200,165,110,0.35); }
        .step-label {
          font-size:10.5px; letter-spacing:0.14em; text-transform:uppercase;
          color: rgba(255,255,255,0.22); margin-bottom:4px;
          animation: fadeUp 0.55s 0.08s cubic-bezier(0.22,1,0.36,1) both;
        }
        .slide-in { animation: slideIn 0.38s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(18px); }
          to   { opacity:1; transform:translateX(0); }
        }
        .nav-row { display:flex; gap:10px; margin-top:6px; }
        .auth-btn-ghost {
          flex:1; padding:14.5px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size:12.5px; font-weight:500;
          letter-spacing:0.09em; text-transform:uppercase;
          color: rgba(255,255,255,0.5);
          cursor:pointer; transition: background 0.2s, color 0.2s;
        }
        .auth-btn-ghost:hover { background:rgba(255,255,255,0.07); color:rgba(255,255,255,0.75); }
        .auth-btn-primary { flex:2; margin-top:0; }
      `}</style>
      <div className="auth-root">
        <div className="auth-panel auth-panel-wide">

          <div className="auth-brand">
            <div className="auth-brand-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#c8a56e" strokeWidth="1" fill="none"/>
                <circle cx="8" cy="8" r="2" fill="#c8a56e" opacity="0.6"/>
              </svg>
            </div>
            <span className="auth-brand-name">CTMS</span>
          </div>

          {/* Step track */}
          <div className="step-track">
            {STEPS.map((_, i) => (
              <div key={i} className={`step-dot ${i === step ? "active" : i < step ? "done" : ""}`} />
            ))}
          </div>

          <p className="step-label">Step {step + 1} of {STEPS.length} — {STEPS[step].title}</p>
          <h1 className="auth-heading">{STEPS[step].title}. <em>{step === 0 ? "details." : step === 1 ? "location." : "setup."}</em></h1>
          <p className="auth-sub">{STEPS[step].subtitle}</p>

          <form className="auth-form slide-in" key={step} onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); next(); }} noValidate>

            {/* STEP 0 — Company */}
            {step === 0 && (
              <>
                <div className="field-group">
                  <label className="field-label">Company Name</label>
                  <input className="field-input" placeholder="Acme Corp" value={form.companyName} onChange={set("companyName")} autoFocus />
                </div>
                <div className="field-group">
                  <label className="field-label">Company Email</label>
                  <input className="field-input" type="email" placeholder="hello@acme.com" value={form.companyEmail} onChange={set("companyEmail")} />
                </div>
                <div className="field-group">
                  <label className="field-label">First Channel Name</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.3)", fontFamily:"'DM Sans',sans-serif", fontSize:"14px" }}>#</span>
                    <input className="field-input" style={{ paddingLeft:"26px" }} placeholder="general" value={form.channelName} onChange={set("channelName")} />
                  </div>
                </div>
              </>
            )}

            {/* STEP 1 — Location */}
            {step === 1 && (
              <>
                <div className="field-group">
                  <label className="field-label">Street Address</label>
                  <input className="field-input" placeholder="123 Main Street" value={form.address} onChange={set("address")} autoFocus />
                </div>
                <div className="field-row">
                  <div className="field-group">
                    <label className="field-label">Pincode</label>
                    <input className="field-input" placeholder="110001" value={form.pincode} onChange={set("pincode")} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">State</label>
                    <input className="field-input" placeholder="Maharashtra" value={form.state} onChange={set("state")} />
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">Country</label>
                  <input className="field-input" placeholder="India" value={form.country} onChange={set("country")} />
                </div>
              </>
            )}

            {/* STEP 2 — Account */}
            {step === 2 && (
              <>
                <div className="field-group">
                  <label className="field-label">Your Name</label>
                  <input className="field-input" placeholder="Aakash Sharma" value={form.userName} onChange={set("userName")} autoFocus />
                </div>
                <div className="field-group">
                  <label className="field-label">Password</label>
                  <div className="field-wrap">
                    <input
                      className="field-input field-input-padded"
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={set("password")}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowPw((v) => !v)}>
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                  {form.password && (
                    <div className="pw-strength">
                      {[1,2,3,4].map((n) => (
                        <div key={n} className="pw-strength-bar" style={{ background: n <= pwStrength ? strengthColors[pwStrength] : undefined }} />
                      ))}
                      <span className="pw-strength-label" style={{ color: strengthColors[pwStrength] }}>{strengthLabels[pwStrength]}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {error && (
              <div className="auth-error" role="alert">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <div className="nav-row">
              {step > 0 && (
                <button type="button" className="auth-btn-ghost" onClick={() => { setError(""); setStep((s) => s - 1); }}>
                  ← Back
                </button>
              )}
              <button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
                {loading && <span className="btn-spinner" />}
                {step < 2 ? "Continue →" : loading ? "Creating…" : "Create workspace"}
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">have an account?</span>
              <div className="auth-divider-line" />
            </div>
            <div className="auth-links" style={{ justifyContent: "center" }}>
              <button className="auth-link auth-link-gold" onClick={() => navigate("/login")}>Sign in instead →</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Register;