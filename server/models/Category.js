const mongoose = require('mongoose');
const Course = require('./Course');
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    Course: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
    ],
});

module.exports = mongoose.model('Category', categorySchema);