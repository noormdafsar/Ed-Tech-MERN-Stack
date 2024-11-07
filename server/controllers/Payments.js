const { instance } = require('../config/razorpay');
const user  = require('../models/user');
const Course = require('../models/Course');
const nodemailer = require('nodemailer');
const { courseEnrollment } = require('../mailTempletes/courseEnrollment');

