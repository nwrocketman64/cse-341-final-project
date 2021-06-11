// Import the models for interacting with the database.

// The default page.
exports.getHome = (req, res, next) => {
  // Deliver the product view and include the list of products.
  res.render('content/index', {
    pageTitle: 'Photo Album Application',
    path: '/'
  });
};