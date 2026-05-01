import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, setToken, setUser } from '../services/api';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm]           = useState({ email: '', password: '' });
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [serverErr, setServerErr] = useState('');

  const validate = () => {
    const e = {};
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address.';
    if (!form.password.trim())
      e.password = 'Password is required.';
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
    const res = await loginUser({
      email: form.email,
      password: form.password,
    });

    setToken(res.token);
    setUser(res.user);
    onLogin(res.user);
    navigate('/home');
  } catch (err) {
    setServerErr(err.message || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

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
          <h2 className="auth-panel-title">Your academic world, beautifully organised.</h2>
          <div className="auth-features">
            <div className="auth-feature"><span>🎓</span> Browse the full scholar directory</div>
            <div className="auth-feature"><span>✨</span> Pop new scholars in instantly</div>
            <div className="auth-feature"><span>💜</span> View rich student profiles</div>
            <div className="auth-feature"><span>🔍</span> Search and filter with ease</div>
          </div>
          <div className="auth-panel-blob blob1" />
          <div className="auth-panel-blob blob2" />
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-box">
          <div className="auth-form-header">
            <h1>Welcome back! 👋</h1>
            <p>Sign in to your Scholar's Hub account</p>
          </div>

          {serverErr && <div className="auth-server-error">⚠ {serverErr}</div>}

          <form onSubmit={handleSubmit} noValidate className="auth-form">
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
                onChange={handleChange} placeholder="••••••••"
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? '⏳ Signing in...' : '✨ Sign In'}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/register">Create one here →</Link>
          </div>

          <div className="auth-demo-hint">
            <p>🧪 <strong>Demo:</strong> Register a new account to get started — it only takes seconds!</p>
          </div>
        </div>
      </div>
    </div>
  );
}