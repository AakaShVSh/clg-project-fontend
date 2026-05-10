const authStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .auth-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0a0a0a;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .auth-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 20% 110%, rgba(180,140,90,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 85% -10%, rgba(160,120,70,0.09) 0%, transparent 55%);
    pointer-events: none;
  }

  .auth-root::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
    background-size: 64px 64px;
    pointer-events: none;
  }

  .auth-panel {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 440px;
    padding: 0 28px;
    animation: fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .auth-panel-wide {
    max-width: 520px;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Brand */
  .auth-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 44px;
    animation: fadeUp 0.55s 0.04s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .auth-brand-icon {
    width: 32px; height: 32px;
    border: 1px solid rgba(200,165,110,0.45);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
  }
  .auth-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 21px; font-weight: 400;
    color: rgba(255,255,255,0.88);
    letter-spacing: 0.05em;
  }

  /* Headings */
  .auth-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px; font-weight: 300;
    color: #fff;
    line-height: 1.1;
    letter-spacing: -0.01em;
    margin-bottom: 8px;
    animation: fadeUp 0.55s 0.08s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .auth-heading em { font-style: italic; color: #c8a56e; }
  .auth-sub {
    font-size: 13.5px; font-weight: 300;
    color: rgba(255,255,255,0.36);
    margin-bottom: 36px;
    letter-spacing: 0.01em;
    animation: fadeUp 0.55s 0.12s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  /* Form */
  .auth-form {
    display: flex; flex-direction: column; gap: 15px;
    animation: fadeUp 0.55s 0.16s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .field-group { display: flex; flex-direction: column; }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .field-label {
    display: block;
    font-size: 10.5px; font-weight: 500;
    letter-spacing: 0.13em; text-transform: uppercase;
    color: rgba(255,255,255,0.32);
    margin-bottom: 7px;
  }
  .field-wrap { position: relative; }
  .field-input {
    width: 100%;
    padding: 13px 15px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; font-weight: 300;
    color: #fff;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    -webkit-appearance: none;
  }
  .field-input::placeholder { color: rgba(255,255,255,0.18); }
  .field-input:focus {
    border-color: rgba(200,165,110,0.4);
    background: rgba(255,255,255,0.055);
  }
  .field-input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px #131008 inset;
    -webkit-text-fill-color: #fff;
  }
  .field-input-padded { padding-right: 44px; }

  /* Password toggle */
  .pw-toggle {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    padding: 4px; color: rgba(255,255,255,0.28);
    transition: color 0.2s; display: flex; align-items: center;
  }
  .pw-toggle:hover { color: rgba(255,255,255,0.55); }

  /* Password strength */
  .pw-strength {
    display: flex; align-items: center; gap: 5px;
    margin-top: 7px;
  }
  .pw-strength-bar {
    flex: 1; height: 2px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    transition: background 0.3s;
  }
  .pw-strength-label {
    font-size: 11px; font-weight: 400;
    margin-left: 4px; min-width: 36px;
    transition: color 0.3s;
  }

  /* Error / Success */
  .auth-error {
    display: flex; align-items: center; gap: 8px;
    padding: 11px 13px;
    background: rgba(220,80,80,0.07);
    border: 1px solid rgba(220,80,80,0.18);
    border-radius: 8px;
    font-size: 12.5px; font-weight: 300;
    color: #e88080;
    animation: shake 0.35s ease;
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-4px); }
    40%,80%  { transform: translateX(4px); }
  }
  .auth-success {
    display: flex; align-items: flex-start; gap: 8px;
    padding: 11px 13px;
    background: rgba(80,200,120,0.06);
    border: 1px solid rgba(80,200,120,0.15);
    border-radius: 8px;
    font-size: 12.5px; font-weight: 300;
    color: rgba(100,220,140,0.85);
  }

  /* Button */
  .auth-btn {
    margin-top: 6px;
    width: 100%; padding: 14.5px;
    background: linear-gradient(135deg, #c8a56e 0%, #a87f44 100%);
    border: none; border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px; font-weight: 500;
    letter-spacing: 0.09em; text-transform: uppercase;
    color: #1a1208;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .auth-btn:hover:not(:disabled) { opacity: 0.88; }
  .auth-btn:active:not(:disabled) { transform: scale(0.99); }
  .auth-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  /* Spinner */
  .btn-spinner {
    display: inline-block; width: 13px; height: 13px;
    border: 2px solid rgba(26,18,8,0.28);
    border-top-color: #1a1208;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Footer */
  .auth-footer {
    margin-top: 28px;
    display: flex; flex-direction: column; gap: 14px;
    animation: fadeUp 0.55s 0.22s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .auth-divider { display: flex; align-items: center; gap: 12px; }
  .auth-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
  .auth-divider-text {
    font-size: 10px; letter-spacing: 0.12em;
    color: rgba(255,255,255,0.18); text-transform: uppercase;
  }
  .auth-links { display: flex; justify-content: space-between; align-items: center; }
  .auth-link {
    font-size: 12.5px; font-weight: 300;
    color: rgba(255,255,255,0.32);
    text-decoration: none; transition: color 0.2s;
    cursor: pointer; background: none; border: none;
    font-family: 'DM Sans', sans-serif;
  }
  .auth-link:hover { color: rgba(255,255,255,0.7); }
  .auth-link-gold { color: rgba(200,165,110,0.65); }
  .auth-link-gold:hover { color: #c8a56e; }

  /* OTP grid */
  .otp-grid {
    display: flex; gap: 10px; justify-content: center;
  }
  .otp-cell {
    width: 48px; height: 56px;
    text-align: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px; font-weight: 400;
    color: #c8a56e;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    caret-color: #c8a56e;
  }
  .otp-cell:focus {
    border-color: rgba(200,165,110,0.45);
    background: rgba(200,165,110,0.04);
  }
`;

export default authStyles;