const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const Database = require("better-sqlite3");

// Auth
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/auth");

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
if (NODE_ENV !== "production") {
  app.use(cors());
}

app.use(express.json());

// ===============================
// ✅ SQLite setup
// ===============================
const dbPath = path.join(__dirname, "database.db");
const db = new Database(dbPath);

console.log("✅ Connected to SQLite database");

// Make DB available to controllers
app.use((req, res, next) => {
  req.db = db;
  next();
});

// ===============================
// ✅ Database schema
// ===============================
db.prepare(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    grade TEXT,
    major TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`).run();

// ===============================
// ✅ Health Check
// ===============================
app.get("/health", (req, res) => {
  res.json({ status: "ok", environment: NODE_ENV });
});

// ===============================
// ✅ Auth Routes
// ===============================
app.use("/api/auth", authRoutes);

// ===============================
// ✅ Protected Student Routes
// ===============================
app.get("/api/students", protect, (req, res) => {
  try {
    const students = db.prepare("SELECT * FROM students").all();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

app.post("/api/students", protect, (req, res) => {
  const { name, email, grade, major } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email required" });
  }

  const result = db
    .prepare(
      "INSERT INTO students (name, email, grade, major) VALUES (?, ?, ?, ?)"
    )
    .run(name, email, grade, major);

  res.status(201).json({
    id: result.lastInsertRowid,
    name,
    email,
    grade,
    major
  });
});

// ===============================
// ✅ Serve Frontend (Production)
// ===============================
if (NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  // Express 5 SPA fallback
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ===============================
// ✅ Global Safety
// ===============================
process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

// ===============================
// ✅ Start Server
// ===============================
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
});

// ===============================
// ✅ Graceful Shutdown
// ===============================
process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});