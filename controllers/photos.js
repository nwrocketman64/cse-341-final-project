const path = require('path');
const fs = require('fs');

// Import the models for interacting with the database.
var imgModel = require('../models/photo');

// The default page.
exports.getHome = (req, res, next) => {
  // Deliver the product view and include the list of products.
  res.render('content/index', {
    pageTitle: 'Photo Album Application',
    path: '/'
  });
};

// Photo Album List.
exports.getPhotos = (req, res, next) => {
  // Deliver the photo list page.
  imgModel.find({userId: req.user}, (err, items) => {
    if (err) {
        console.log(err);
        res.status(500).send('An error occurred', err);
    }
    else {
        res.render('content/photo-list', {
        pageTitle: 'Album',
        path: '/album',
        items: items
      });
    };
  });
};

// Photo Details.
exports.getPhotoDetails = (req, res, next) => {
  // Deliver the photo page.
  res.render('content/photo-details', {
    pageTitle: 'Photo Details',
    path: '/'
  });
};

// The function returns the photo.
exports.getPhoto = (req, res, next) => {
  // Return a photo.
};

// The function get the upload photo page
exports.getUploadPhoto = (req, res, next) => {
  res.render('content/photo-upload', {
    pageTitle: 'Upload a Photo',
    path: '/upload'
  });
};

// The function handles the uploaded image.
exports.postUploadPhoto = (req, res, next) => {
  const image = req.file;
  if (!image) {
    return res.status(422).render('content/photo-upload', {
      pageTitle: 'Upload a Photo',
      path: '/upload'
    });
  };
  var obj = {
    name: image.filename,
    date: Date.now(),
    userId: req.user,
    img: {
        data: fs.readFileSync(path.join(path.dirname(process.mainModule.filename) + '/images/' + image.filename)),
        contentType: image.mimetype
    }
  }
  imgModel.create(obj, (err, item) => {
      if (err) {
          console.log(err);
      }
      else {
          // item.save();
          res.redirect('/album');
      }
  });
  
};