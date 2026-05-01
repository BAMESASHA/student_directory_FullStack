const express = require('express');
const { body } = require('express-validator');
const {
  getAllStudents, getStudentById,
  createStudent, updateStudent, deleteStudent,
} = require('../controllers/studentController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Validation rules for create/update
const studentRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('studentId').trim().notEmpty().withMessage('Student ID is required'),
  body('major').trim().notEmpty().withMessage('Major is required'),
  body('year').trim().notEmpty().withMessage('Year is required'),
  body('gpa').isFloat({ min: 0, max: 4 }).withMessage('GPA must be between 0 and 4'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
];

const updateRules = studentRules.filter((r) =>
  !r.builder?.fields?.includes('studentId')
);

// Public — anyone can read
router.get('/',    getAllStudents);
router.get('/:id', getStudentById);

// Protected — must be logged in to create
router.post('/',    protect, studentRules,  createStudent);

// Protected + Admin only — update and delete
router.put('/:id',    protect, adminOnly, updateRules, updateStudent);
router.delete('/:id', protect, adminOnly,              deleteStudent);

module.exports = router;