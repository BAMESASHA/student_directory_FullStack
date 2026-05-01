import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, setToken, setUser } from '../services/api';

export default function Register({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm]           = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [serverErr, setServerErr] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim())                                              e.name     = 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))               e.email    = 'Enter a valid email address.';
    if (form.password.length < 6)                                      e.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirm)                                e.confirm  = 'Passwords do not match.';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    if (serverErr) setServerErr('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setLoading(true);
  try {
    // ✅ ONLY send what backend expects
    const res = await registerUser({
      email: form.email,
      password: form.password,
    });

    setToken(res.token);
    setUser(res.user);
    onLogin(res.user);

    navigate("/home");
  } catch (err) {
    setServerErr(err.message || "Registration failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const strength = !form.password ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#10b981'];

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-panel-content">
          <div className="auth-logo">
            <div className="logo-wrap">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3L2 8l10 5 10-5-10-5z" fill="white" opacity="0.95"/>
                <path d="M2 8v6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M6 10.5v4.5c0 1.5 2.5 3 6 3s6-1.5 6-3v-4.5" fill="white" opacity="0.7"/>
              </svg>
            </div>
            <span className="auth-brand">Scholar's Hub</span>
          </div>
          <h2 className="auth-panel-title">Join the Scholar's Hub community today.</h2>
          <div className="auth-features">
            <div className="auth-feature"><span>🎓</span> Free to register — no credit card</div>
            <div className="auth-feature"><span>✨</span> Add and manage student profiles</div>
            <div className="auth-feature"><span>💜</span> Beautiful, responsive interface</div>
            <div className="auth-feature"><span>🔒</span> Secure JWT-based authentication</div>
          </div>
          <div className="auth-panel-blob blob1" />
          <div className="auth-panel-blob blob2" />
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-box">
          <div className="auth-form-header">
            <h1>Create your account ✨</h1>
            <p>Join Scholar's Hub and manage your directory</p>
          </div>

          {serverErr && <div className="auth-server-error">⚠ {serverErr}</div>}

          <form onSubmit={handleSubmit} noValidate className="auth-form">
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text" name="name" value={form.name}
                onChange={handleChange} placeholder="e.g. Amara Diallo"
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="auth-field">
              <label>Email Address</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@university.edu"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="At least 6 characters"
                className={errors.password ? 'input-error' : ''}
              />
              {form.password && (
                <div className="strength-bar-wrap">
                  <div className="strength-bar">
                    <div className="strength-fill" style={{ width: `${(strength / 3) * 100}%`, background: strengthColor[strength] }} />
                  </div>
                  <span style={{ color: strengthColor[strength], fontSize: '0.75rem', fontWeight: 700 }}>
                    {strengthLabel[strength]}
                  </span>
                </div>
              )}
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="auth-field">
              <label>Confirm Password</label>
              <input
                type="password" name="confirm" value={form.confirm}
                onChange={handleChange} placeholder="Repeat your password"
                className={errors.confirm ? 'input-error' : ''}
              />
              {errors.confirm && <span className="field-error">{errors.confirm}</span>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? '⏳ Creating account...' : '🎓 Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in here →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}