// Import the needed libraries.
const express = require('express');
const { check, body } = require('express-validator');

// Import the auth controller and the user model.
const authController = require('../controllers/auth');
const User = require('../models/user');

// Create the router.
const router = express.Router();

// GET /login
router.get('/login', authController.getLogin);

// GET /signup
router.get('/signup', authController.getSignup);

// POST /login
router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .normalizeEmail(),
        body('password')
            .isLength({ min: 5 })
            .trim()
    ],
    authController.postLogin
);

// POST /signup
router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .custom((value, {req}) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(
                            'E-Mail exists already'
                        )
                    }
                });
            })
            .normalizeEmail(),
        body('password')
            .isLength({ min: 5 })
            .trim(),
        body('confirmPassword')
            .trim()
    ],
    authController.postSignup
);

// POST /logout
router.post('/logout', authController.postLogout);

// Export the router.
module.exports = router;