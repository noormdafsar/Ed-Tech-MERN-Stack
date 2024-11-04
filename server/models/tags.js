const mongoose = require('mongoose');
const { Schema } = mongoose;
const Course = require('./Course');

const tagSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
    ],
});

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
//module.exports = mongoose.model('Tag', tagSchema);