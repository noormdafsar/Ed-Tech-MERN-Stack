const express = require('express');
const Router = express.Router();
const { auth, isInstructor, isAdmin, isStudent } = require('../middlewares/auth');

const { upateProfile, deleteAccount } = require('../controllers/Profile');