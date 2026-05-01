const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// ===============================
// 🌍 Environment
// ===============================
dotenv.config();
const app = express();

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 5000;

// ===============================
// ✅ Middleware
// ===============================

// Enable CORS only in development
if (NODE_ENV !== "production") {
  app.use(cors());
}

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
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      grade TEXT,
      major TEXT
    )
  `);
});

// ===============================
// ✅ Health Check (Railway)
// ===============================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: NODE_ENV
  });
});

// ===============================
// ✅ API Routes
// ===============================

// Get all students
app.get("/api/students", (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
      console.error("❌ Fetch error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add a student
app.post("/api/students", (req, res) => {
  const { name, email, grade, major } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const query =
    "INSERT INTO students (name, email, grade, major) VALUES (?, ?, ?, ?)";

  db.run(query, [name, email, grade, major], function (err) {
    if (err) {
      console.error("❌ Insert error:", err.message);
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      id: this.lastID,
      name,
      email,
      grade,
      major
    });
  });
});

// ===============================
// ✅ Serve Frontend (Production)
// ===============================
if (NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  // SPA fallback (React Router support)
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ===============================
// ✅ Global error safety (recommended)
// ===============================
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});

// ===============================
// ✅ Start Server (FIXED FOR RAILWAY)
// ===============================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
});