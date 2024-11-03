const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

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
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});


userSchema.methods.getJWT =  async function(){
    const user = this;
    // create a jwt token with the help of user id and secret key
    const payload = {
         _id: user._id, 
         accountType: user.acccountType, 
         email: user.email,
    }
    const token = await jwt.sign(
        payload, 
        process.env.JWT_TOKEN, {expiresIn: '7d',});
    return token;
}

userSchema.methods.validatePassword = async function(password) {
   try {
    const user = this;
    const hashedPassword = user.password;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
   }
   catch(error) {
       console.log(error);
       throw new Error('Error while validating password');
   }
}

module.exports = mongoose.model('User', userSchema);