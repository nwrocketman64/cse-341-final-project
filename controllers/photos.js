// Import the models for interacting with the database.

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
  res.render('content/photo-list', {
    pageTitle: 'Album',
    path: '/album'
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