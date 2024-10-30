const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingAndReviewsSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    rating: {
        type: Number,
        required: true,
    },
    reviews: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course',
        index: true,
    }
});

module.exports = mongoose.model('RatingAndReview', ratingAndReviewsSchema);