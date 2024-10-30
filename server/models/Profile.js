const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new Schema({
    gender: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Profile', profileSchema);