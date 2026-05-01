const { validationResult } = require("express-validator");
const db = require("../config/db");

// GET /api/students
const getAllStudents = (req, res, next) => {
  try {
    const { search, major } = req.query;
    const students = db.getAllStudents(search, major);
    res.json({ success: true, count: students.length, data: students });
  } catch (err) {
    next(err);
  }
};

// GET /api/students/:id
const getStudentById = (req, res, next) => {
  try {
    const student = db.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Scholar not found." });
    }
    res.json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
};

// POST /api/students
const createStudent = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, studentId, major, year, gpa, email, phone, bio, courses } = req.body;

    const existing = db.getStudentByStudentId(studentId);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Student ID "${studentId}" is already registered.`,
      });
    }

    const newStudent = db.createStudent({
      name, studentId, major, year, gpa, email, phone, bio,
      courses: courses || [],
    });

    res.status(201).json({
      success: true,
      message: `${newStudent.name} has been popped into Scholar's Hub! 🎉`,
      data: newStudent,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/students/:id
const updateStudent = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const student = db.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Scholar not found." });
    }

    const updated = db.updateStudent(req.params.id, req.body);
    res.json({
      success: true,
      message: `${updated.name}'s profile has been updated! ✨`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/students/:id
const deleteStudent = (req, res, next) => {
  try {
    const student = db.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Scholar not found." });
    }

    const deleted = db.deleteStudent(req.params.id);
    res.json({
      success: true,
      message: `${deleted.name} has been removed from Scholar's Hub.`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};