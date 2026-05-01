import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <NavLink to="/home" className="navbar-brand">
        <div className="logo-wrap">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 3L2 8l10 5 10-5-10-5z" fill="white" opacity="0.95"/>
            <path d="M2 8v6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6 10.5v4.5c0 1.5 2.5 3 6 3s6-1.5 6-3v-4.5" fill="white" opacity="0.7"/>
            <circle cx="19" cy="4" r="1.5" fill="#f9a8d4"/>
          </svg>
        </div>
        <span className="brand-name">Scholar's Hub</span>
      </NavLink>

      <ul className="nav-links">
        <li>
          <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            🏠 Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/list" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            📋 Directory
          </NavLink>
        </li>

        {user ? (
          <>
            <li>
              <NavLink to="/add" className={({ isActive }) => isActive ? 'nav-link active nav-link-pop' : 'nav-link nav-link-pop'}>
                ✨ Pop a Scholar In
              </NavLink>
            </li>
            <li className="nav-user">
              <div className="nav-avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <span className="nav-username">{user.name?.split(' ')[0]}</span>
              <button className="nav-logout-btn" onClick={handleLogout}>Sign Out</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                🔑 Sign In
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active nav-link-pop' : 'nav-link nav-link-pop'}>
                🎓 Register
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}