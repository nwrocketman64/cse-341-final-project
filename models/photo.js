// Import mongoose to provide the schema for the database.
const mongoose = require('mongoose');

// Import the Schema.
const Schema = mongoose.Schema;
 
// Create the image schema.
const imageSchema = new mongoose.Schema({
    name: String,
    date: Date,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    img:
    {
        data: Buffer,
        contentType: String
    }
});

// Export the schema.
module.exports = new mongoose.model('Image', imageSchema);