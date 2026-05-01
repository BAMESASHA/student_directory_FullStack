const express = require("express");
const { body } = require("express-validator");
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ===============================
// ✅ Validation rules (aligned with DB schema)
// ===============================
const studentRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Enter a valid email"),
  body("major").optional().trim(),
  body("grade").optional().trim(),
];

// ===============================
// ✅ Routes
// ===============================

// Public or protected read (recommended: protected for assignment)
router.get("/", protect, getAllStudents);
router.get("/:id", protect, getStudentById);

// Protected — must be logged in
router.post("/", protect, studentRules, createStudent);
router.put("/:id", protect, studentRules, updateStudent);
router.delete("/:id", protect, deleteStudent);

module.exports = router;