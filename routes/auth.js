// Import the needed libraries.
const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

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

router.post('/logout', authController.postLogout);

module.exports = router;