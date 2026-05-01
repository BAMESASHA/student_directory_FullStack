const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const JWT_SECRET = process.env.JWT_SECRET || "submission_secret_key";

// ===============================
// Helper: Generate JWT token
// ===============================
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

// ===============================
// POST /api/auth/register
// ===============================
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = req.db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);

    if (existingUser) {
      return res.status(409).json({
        error: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = req.db
      .prepare("INSERT INTO users (email, password) VALUES (?, ?)")
      .run(email, hashedPassword);

    const user = { id: result.lastInsertRowid, email };
    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// ===============================
// POST /api/auth/login
// ===============================
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = req.db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

// ===============================
// GET /api/auth/me
// ===============================
exports.getMe = (req, res) => {
  try {
    const user = req.db
      .prepare("SELECT id, email FROM users WHERE id = ?")
      .get(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};