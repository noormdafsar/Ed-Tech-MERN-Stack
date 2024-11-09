const express = require('express');
const router = express.Router();
const { auth, isInstructor, isAdmin, isStudent } = require('../middlewares/auth');

const { upateProfile, deleteAccount } = require('../controllers/Profile');

// routes
router.put('/updateProfile', auth, upateProfile);
router.delete('/deleteProfile', auth, deleteAccount);


module.exports = router;