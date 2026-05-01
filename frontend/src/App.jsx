import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import List from "./pages/List";
import Details from "./pages/Details";
import AddItem from "./pages/AddItem";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {
  fetchStudents,
  createStudent as apiCreateStudent,
  getUser,
  setUser,
  removeUser,
  removeToken,
} from "./services/api";

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setCurrentUser] = useState(getUser());

  // ✅ Fetch students ONLY when user is logged in
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    fetchStudents()
      .then((data) => {
        setStudents(data); // ✅ correct shape
        setError(null);
      })
      .catch((err) => {
        console.error("Student fetch error:", err.message);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setUser(userData);
  };

  const handleLogout = () => {
    removeToken();
    removeUser();
    setCurrentUser(null);
    setStudents([]);
  };

  const addStudent = async (studentForm) => {
    try {
      const res = await apiCreateStudent(studentForm);
      setStudents((prev) => [res, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "1.5rem"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={user ? <Navigate to="/home" replace /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/home" replace /> : <Register onLogin={handleLogin} />}
          />

          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* ✅ Protected routes */}
          <Route
            path="/home"
            element={user ? <Home user={user} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/list"
            element={user ? <List students={students} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/details/:id"
            element={user ? <Details students={students} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/add"
            element={user ? <AddItem onAdd={addStudent} /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
