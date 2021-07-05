// Get the needed libraries.
const path = require('path');
const fs = require('fs');

// Import the models for interacting with the database.
var imgModel = require('../models/photo');

// The default page.
exports.getHome = (req, res, next) => {
  // Deliver the product view and include the list of products.
  res.render('content/index', {
    pageTitle: 'Home',
    path: '/'
  });
};

// Photo Album List.
exports.getPhotos = (req, res, next) => {
  // Deliver the photo list page.
  imgModel.find({userId: {$in: [req.session.user._id]}}, (err, items) => {
    // If there was an error, get the 500 page.
    if (err) {
        console.log(err);
        res.status(500).send('An error occurred', err);
    }
    // Else, render the album page.
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
  // Get the id from the URL.
  const productId = req.params.id;
  // Find the photo from the database.
  imgModel.findOne({_id: productId}, (err, image) => {
    // If there was an error, redirect to the 500 page.
    if (err) {
        console.log(err);
        res.status(500).send('An error occurred', err);
    }
    // If not, render the photo-view page.
    else {
        res.render('content/photo-view', {
        pageTitle: image.name,
        path: '/album',
        image: image
      });
    };
  });
};

// The function returns the photo.
exports.getPhoto = (req, res, next) => {
  // The photo id from the URL
  const productId = req.params.id;
  // Return a photo.
  return imgModel.findOne({_id: productId}, (err, image) => {
    // If there was an error, redirect to the 500 page.
    if (err) {
      console.log(err);
      res.status(500).send('An error occurred', err);
    }
    // If not, return the image.
    else {
      // Set the contentType for the response.
      res.contentType(image.img.contentType);
      // Send the image data.
      res.send(image.img.data);
    }
  });
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
  // Get the image from the file buffer.
  const image = req.file;
  
  // If there is no image.
  if (!image) {
    // Redirect back to the photo upload with a 422 code.
    return res.status(422).render('content/photo-upload', {
      pageTitle: 'Upload a Photo',
      path: '/upload'
    });
  };
  // create the object that will hold the image data.
  var obj = {
    name: image.filename,
    date: Date.now(),
    userId: req.session.user,
    img: {
        data: fs.readFileSync(path.join(path.dirname(process.mainModule.filename) + '/images/' + image.filename)),
        contentType: image.mimetype
    }
  }

  // Save the image to the database.
  imgModel.create(obj, (err, item) => {
      // If there was an error, log it.
      if (err) {
          console.log(err);
      }
      else {
          // item.save();
          fs.unlink(path.join(path.dirname(process.mainModule.filename) + '/images/' + image.filename), (err) => {
            if (err) {
              console.error(err)
              res.status(500).send('An error occurred', err);
            }
          });
          // Redirect the user back to album page.
          return res.redirect('/album');
      }
  });  
};

// The function returns the delete photo page.
exports.getDeletePhoto = (req, res, next) => {
  // Get the id from the URL.
  const productId = req.params.id;

  // Deliver the delete photo page.
  imgModel.findOne({_id: productId}, (err, image) => {
    // If there was an error, redirect to the 500 page.
    if (err) {
        console.log(err);
        res.status(500).send('An error occurred', err);
    }

    // If not, render the page.
    else {
        res.render('content/delete-photo', {
        pageTitle: "Delete " + image.name,
        path: '/album',
        image: image
      });
    };
  });
};

// The function will delete the image from the database.
exports.postDeletePhoto = (req, res, next) => {
  // Get the id from the body of the request.
  const productId = req.body.id;

  // The delete the image.
  imgModel.deleteOne({_id: productId}, (err) => {
    if (err){
      // If there was an error, redirect to the 500 page.
      return res.status(500).send('An error occurred', err);
    }
    else {
      console.log("The Photo has been deleted");
    }

    // If not, return to the album page.
    return res.redirect('/album');
  });
};