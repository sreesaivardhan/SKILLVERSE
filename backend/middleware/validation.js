const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User registration validation rules
const registerValidation = [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  body('role').optional().isIn(['learner', 'instructor', 'admin']),
  validate
];

// User login validation rules
const loginValidation = [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists(),
  validate
];

// Session creation validation rules
const sessionValidation = [
  body('instructor', 'Instructor ID is required').not().isEmpty(),
  body('learner', 'Learner ID is required').not().isEmpty(),
  body('skill', 'Skill is required').not().isEmpty(),
  body('startTime', 'Start time is required').isISO8601(),
  body('duration', 'Duration must be a positive number').isInt({ min: 1 }),
  body('credits', 'Credits must be a positive number').isInt({ min: 1 }),
  validate
];

// Skill creation validation rules
const skillValidation = [
  body('name', 'Skill name is required').not().isEmpty(),
  body('category', 'Category is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty(),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  sessionValidation,
  skillValidation
};
