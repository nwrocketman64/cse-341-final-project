// Import the needed libraries.
const path = require('path');

// Import the added libraries.
const express = require('express');

// Import the auth code middleware.
const isAuth = require('../middleware/is-auth');

// Import the photo controller.
const photoController = require('../controllers/photos');

// Setup the router.
const router = express.Router();

// GET / aka the home page.
router.get('/', photoController.getHome);

// GET /album
router.get('/album', isAuth, photoController.getPhotos);

// GET /upload
router.get('/upload', isAuth, photoController.getUploadPhoto);

// POST /upload
router.post('/upload', isAuth, photoController.postUploadPhoto);

// Export the router.
module.exports = router;
