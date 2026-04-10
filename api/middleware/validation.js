const { body } = require('express-validator');

// Rules for registering a new user
const validateRegister = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Rules for creating or updating a recipe
const validateRecipe = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['cooking', 'baking']).withMessage('Category must be cooking or baking'),
  body('ingredients')
    .isArray({ min: 1 }).withMessage('At least one ingredient is required'),
  body('instructions')
    .trim()
    .notEmpty().withMessage('Instructions are required'),
  body('cookingTime')
    .isInt({ min: 1 }).withMessage('Cooking time must be a positive number'),
  body('difficulty')
    .isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
  body('servings')
    .isInt({ min: 1 }).withMessage('Servings must be a positive number')
];

module.exports = { validateRegister, validateRecipe };