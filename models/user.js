// Import mongoose to provide the schema for the database.
const mongoose = require('mongoose');

// Import the Schema.
const Schema = mongoose.Schema;

// Create the user schema.
const userSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// Export the schema.
module.exports = mongoose.model('User', userSchema);