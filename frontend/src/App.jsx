import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import List from './pages/List';
import Details from './pages/Details';
import AddItem from './pages/AddItem';
import Login from './pages/Login';
import Register from './pages/Register';
import {
  fetchStudents,
  createStudent as apiCreateStudent,
  getUser, setUser,
  removeUser, removeToken,
} from './services/api';

export default function App() {
  const [students, setStudents]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [user, setCurrentUser]    = useState(getUser());

  useEffect(() => {
    fetchStudents()
      .then((res) => { setStudents(res.data); setError(null); })
      .catch((err) => { console.error('Backend error:', err.message); setError(err.message); })
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setUser(userData);
  };

  const handleLogout = () => {
    removeToken();
    removeUser();
    setCurrentUser(null);
  };

  const addStudent = async (studentForm) => {
    try {
      const res = await apiCreateStudent({ ...studentForm, courses: studentForm.courses || [] });
      setStudents((prev) => [res.data, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  if (loading) {
    return (
      <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'100vh', fontFamily:'Boogaloo, cursive', fontSize:'1.5rem', color:'#a855f7', gap:'1rem' }}>
        <div style={{ fontSize:'3rem' }}>🎓</div>
        <div>Loading Scholar's Hub...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'100vh', fontFamily:'Boogaloo, cursive', textAlign:'center', padding:'2rem', gap:'1rem' }}>
        <div style={{ fontSize:'3rem' }}>😕</div>
        <h2 style={{ color:'#a855f7', fontSize:'1.8rem' }}>Backend Not Connected</h2>
        <p style={{ color:'#9d6fb5', maxWidth:'400px' }}>Make sure your backend is running on port 5000.</p>
        <p style={{ color:'#9d6fb5', fontSize:'0.9rem' }}>
          Run <code style={{ background:'#f3e8ff', padding:'0.2rem 0.5rem', borderRadius:'4px' }}>npm run dev</code> inside your <strong>scholars-hub-backend</strong> folder, then refresh.
        </p>
        <button onClick={() => window.location.reload()} style={{ background:'linear-gradient(135deg,#a855f7,#f472b6)', color:'#fff', border:'none', padding:'0.7rem 1.5rem', borderRadius:'999px', cursor:'pointer', fontFamily:'Boogaloo, cursive', fontSize:'1rem' }}>
          🔄 Try Again
        </button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/login"       element={user ? <Navigate to="/home" replace /> : <Login onLogin={handleLogin} />} />
          <Route path="/register"    element={user ? <Navigate to="/home" replace /> : <Register onLogin={handleLogin} />} />
          <Route path="/"            element={<Navigate to="/home" replace />} />
          <Route path="/home"        element={<Home user={user} />} />
          <Route path="/list"        element={<List students={students} />} />
          <Route path="/details/:id" element={<Details students={students} />} />
          <Route path="/add"         element={user ? <AddItem onAdd={addStudent} /> : <Navigate to="/login" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}