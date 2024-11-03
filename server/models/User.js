const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid Email Address');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,

        maxLength: 20,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error('Enter the strong password');
            }
        }
    },
    confirmPassword: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 20,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error('Enter the strong password');
            }
        }
    },
    accountType: {
        type: String,
        enum: ['Student', 'Instructor', 'Admin'],

        required: true,
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profile',
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
        },
    ],
    image: {
        type: String,
        required: true,
    },
    courseProgress: [
        {
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CourseProgress',
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);