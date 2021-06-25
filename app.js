// Import the needed Libraries.
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const csrf = require('csurf');
const flash = require('connect-flash');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Import the error controller
const errorController = require('./controllers/error');

// Import the routes.
const authRoutes = require('./routes/auth');
const photoRoutes = require('./routes/photos');

// Import the needed models
const User = require('./models/user');

// Create the web app.
const app = express();
const PORT = process.env.PORT || 5000
const MONGODB_URL = "mongodb+srv://development_user:altosax12@cluster0.mafxm.mongodb.net/photo?retryWrites=true&w=majority";

// Setup the sessions.
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions'
});
const csrfProtection = csrf();

// Set render engine.
app.set('view engine', 'ejs');
app.set('views', 'views');

// Make the public folder open.
app.use(express.static(path.join(__dirname, 'public')));

// Use the encoder.
app.use(bodyParser.urlencoded({extended: false}));

// Create the session for the user.
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

// Check if the user has a session.
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

// Autenticate the user.
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Get the current user.
app.use((req, res, next) => {
  User.findOne()
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

// Follow the routing for the web app.
app.use(authRoutes);
app.use(photoRoutes);

// Deliver the 500 page if the user is not authorized.
app.use('/500', errorController.get500);

// Deliver the 404 page if no other options work.
app.use(errorController.get404);

// Deliver the 500 page if there was an error.
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render('500', {
    pageTitle: 'Error',
    path: '/500'
  });
});

// Have the app listen on current port.
mongoose
  .connect(
    MONGODB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    }
  )
  .then(result => {
    // This should be your user handling code implement following the course videos
    app.listen(PORT);
    console.log('Listening on port ' + PORT);
  })
  .catch(err => {
    console.log(err);
  });