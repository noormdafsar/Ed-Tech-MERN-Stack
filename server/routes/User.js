const express = require('express');
const router = express.Router();

const { signup, login, changePassword } = require('../controllers/Auth');
const { resetPasswordToken, resetPassword } = require('../controllers/ResetPassword');
const { userAuth, adminAuth, studentAuth, instructorAuth } = require('../middlewares/auth');

// user routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/changepassword', userAuth, changePassword);
router.post('/reset-password-token', resetPasswordToken);
router.post('/reset-password', resetPassword);

module.exports = router;

