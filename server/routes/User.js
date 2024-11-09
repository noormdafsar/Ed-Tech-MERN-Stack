const express = require('express');
const {
    signup,
    login,
    logout,
    getUser,
    sendOTP,
    verifyOTP,
    resetPassword,
    updatePassword,
} = require('../controllers/User');
const { userAuth, adminAuth, studentAuth, instructorAuth } = require('../middlewares/auth');

const router = express.Router();