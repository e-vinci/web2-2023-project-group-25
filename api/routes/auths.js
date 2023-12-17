const express = require('express');
const { register, login } = require('../models/users');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Function to do Register validation tests
const registrationValidationRules = () => {
  return [
    body('username').notEmpty().withMessage('Username is required').isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 8, max: 30 }).withMessage('Password must be between 8 and 30 characters'),
  ];
};
//Function to perform Login validation tests
const loginValidationRules = () => {
  return [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ];
};
//Function to see if there are errors if yes returns the errors otherwise returns next
const validate = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (errors.isEmpty()) {
    return next();
  }
  const errorMessages = errors.array().map((error) => error.msg);
  return res.status(400).json({ errors: errorMessages });
};

/* Register a user */
router.post('/register', registrationValidationRules(), validate, async (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  const authenticatedUser = await register(username, password);

  if (!authenticatedUser) return res.sendStatus(409); // 409 Conflict

  return res.json(authenticatedUser);
});

/* Login a user */
router.post('/login', loginValidationRules(), validate, async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const authenticatedUser = await login(username, password);

  if (!authenticatedUser) return res.sendStatus(401); // 401 Unauthorized

  return res.json(authenticatedUser);
});

module.exports = router;
