// Import the encryption package.
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

// Import the user model.
const User = require('../models/user');

// The function delievers the login view.
exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        email: ''
    });
};

// The function brings the signup view.
exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        first: '',
        last: '',
        email: ''
    });
};

// The function logins in a user.
exports.postLogin = (req, res, next) => {
    // Get the data from the form.
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    // Validate the input.
    if (email == '' || password == '' || !errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'There was an error during login',
            email: email 
        });
    };

    // If it passes, check to see if the login passes.
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                return res.status(422).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: 'Invalid email or password.',
                    email: email
                });
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            res.redirect('/album');
                        });
                    }
                    return res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Invalid email or password.',
                        email: email
                      });
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
        })
        .catch(err => {
            // If there was an error, redirect to 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// The function creates a new user.
exports.postSignup = (req, res, next) => {
    // Get the data from the forms.
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);

    // Validate the data.
    if (firstname == '' || lastname == '' || email == '' || password == '' || confirmPassword == '' || password != confirmPassword || !errors.isEmpty()) {
        // If it fails, return to the page again.
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: 'All entry fields are required',
            first: firstname,
            last: lastname,
            email: email
        });
    };

    // If validation passed, create new user.
    User.findOne({email: email})
        .then(userDoc => {
            // If the user exist, redirect back to signup.
            if (userDoc){
                return res.status(422).render('auth/signup', {
                    path: '/signup',
                    pageTitle: 'Signup',
                    errorMessage: 'The email already exist.',
                    first: firstname,
                    last: lastname,
                    email: email
                });
            }
            // Encrypt the password and then save the user.
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        password: hashedPassword,
                        cart: {items: []}
                    });
                    return user.save();
                })
                .then(result => {
                    res.redirect('/login');
                });
        })
        .catch(err => {
            // If there was an error, redirect to 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// The function logouts the user.
exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
};