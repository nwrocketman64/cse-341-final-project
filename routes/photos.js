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

// GET /view-photo/:id
router.get('/view-photo/:id', isAuth, photoController.getPhotoDetails);

// GET /download-photo/:id
router.get('/download-photo/:id', isAuth, photoController.getPhoto);

// GET /upload
router.get('/upload', isAuth, photoController.getUploadPhoto);

// POST /upload
router.post('/upload', isAuth, photoController.postUploadPhoto);

// GET /delete-photo/:id
router.get('/delete-photo/:id', isAuth, photoController.getDeletePhoto);

// POST /delete-photo
router.post('/delete-photo', isAuth, photoController.postDeletePhoto);

// Export the router.
module.exports = router;
