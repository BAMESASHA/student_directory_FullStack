const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ===============================
// ✅ SQLite setup
// ===============================

const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ SQLite connection error:", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

// Create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    grade TEXT,
    major TEXT
  )
`);

// ===============================
// ✅ API Routes
// ===============================

// Get all students
app.get("/api/students", (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add student
app.post("/api/students", (req, res) => {
  const { name, email, grade, major } = req.body;

  db.run(
    `INSERT INTO students (name, email, grade, major)
     VALUES (?, ?, ?, ?)`,
    [name, email, grade, major],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        name,
        email,
        grade,
        major
      });
    }
  );
});

// Update student
app.put("/api/students/:id", (req, res) => {
  const { name, email, grade, major } = req.body;
  const { id } = req.params;

  db.run(
    `UPDATE students
     SET name = ?, email = ?, grade = ?, major = ?
     WHERE id = ?`,
    [name, email, grade, major, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json({ message: "Student updated" });
    }
  );
});

// Delete student
app.delete("/api/students/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM students WHERE id = ?", id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted" });
  });
});

// ===============================
// ✅ Serve Frontend (ONE URL)
// ===============================

const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ===============================
// ✅ Start server (Railway-safe)
// ===============================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});