const mongoose = require('mongoose');

const Schema = mongoose.Schema;
 
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

module.exports = new mongoose.model('Image', imageSchema);