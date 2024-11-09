const express = require('express');
const router = express.Router();

// Import controllers
const { signup, login, sendOTP, changePassword } = require('../controllers/Auth');
console.log({
    signup: !!signup,
    login: !!login,
    sendOTP: !!sendOTP,
    changePassword: !!changePassword,
});
const { resetPasswordToken, resetPassword } = require('../controllers/ResetPassword');
const { auth } = require('../middlewares/auth');

// Verify controllers before using them
console.log("Auth Controllers:", { signup, login, changePassword });
console.log("Reset Controllers:", { resetPasswordToken, resetPassword });

// Define routes 
router.post('/signup', signup);
router.post('/login', login);
router.post('/sendotp', sendOTP);
router.post('/changepassword', auth, changePassword);
router.post('/reset-password-token', resetPasswordToken);
router.post('/reset-password', resetPassword);

module.exports = router;
