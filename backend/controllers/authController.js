const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const db = require("../config/db");
require("dotenv").config();

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered. Please log in.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userRole = role === "admin" ? "admin" : "user";

    const newUser = db.createUser({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: `Welcome to Scholar's Hub, ${newUser.name}! 🎓`,
      token,
      user: {
        id:    newUser.id,
        name:  newUser.name,
        email: newUser.email,
        role:  newUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}! ✨`,
      token,
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = (req, res, next) => {
  try {
    const user = db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({
      success: true,
      user: {
        id:        user.id,
        name:      user.name,
        email:     user.email,
        role:      user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };