import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-sparkles">
          <span>✨</span><span>🌟</span><span>💜</span><span>🩷</span><span>✨</span>
        </div>

        <div className="home-badge">🎓 Student Information System</div>

        <h1 className="home-title">
          Welcome to <span className="title-grad">Scholar's Hub</span>
        </h1>

        <p className="home-subtitle">
          Your glam command centre for student profiles. Browse, discover,
          and pop new scholars in — all in one gorgeous place.
        </p>

        <div className="home-actions">
          <button className="btn-primary" onClick={() => navigate('/list')}>
            📋 Browse Directory
          </button>
          <button className="btn-secondary" onClick={() => navigate('/add')}>
            ✨ Pop a Scholar In
          </button>
        </div>
      </div>

      <div className="home-stats">
        <div className="stat-card">
          <span className="stat-emoji">🎓</span>
          <span className="stat-number">5+</span>
          <span className="stat-label">Enrolled Scholars</span>
        </div>
        <div className="stat-card">
          <span className="stat-emoji">📚</span>
          <span className="stat-number">4</span>
          <span className="stat-label">Programmes</span>
        </div>
        <div className="stat-card">
          <span className="stat-emoji">⭐</span>
          <span className="stat-number">3.7</span>
          <span className="stat-label">Average GPA</span>
        </div>
      </div>

      <div className="home-features">
        <div className="feature">
          <span className="feature-icon">🔍</span>
          <h3>Search Scholars</h3>
          <p>Find any student by name, ID, or major instantly.</p>
        </div>
        <div className="feature">
          <span className="feature-icon">💜</span>
          <h3>View Profiles</h3>
          <p>Full student profiles with courses, GPA, and contact info.</p>
        </div>
        <div className="feature">
          <span className="feature-icon">✨</span>
          <h3>Pop Scholars In</h3>
          <p>Register new students with a sleek validated form.</p>
        </div>
      </div>
    </div>
  );
}