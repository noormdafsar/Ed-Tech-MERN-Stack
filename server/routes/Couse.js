const express = require('express');
const router = express.Router();

const { auth, isStudent, isInstructor, isAdmin } = require('../middlewares/auth');
const { createCourse, getAllCourses, getCourseDetails } = require('../controllers/Course');
const { createCategory, showAllCategories, categoryPageDetails } = require('../controllers/Category');
const { createSection, updateSection, deleteSection } = require('../controllers/Section');
const { createSubSection, updateSubSection, deleteSubSection } = require('../controllers/SubSection');
const { createRating, getAverageRating, getAllRatingReview } = require('../controllers/RatingandReview');

const { updateCourseProgress } = require('../controllers/courseProgress');

// routes
router.post('/createCourse', auth, isInstructor, createCourse);
router.post('/addSection', auth, isInstructor, createSection);
router.post('/addSubSection', auth, isInstructor, createSubSection);
router.post('/updateSection', auth, isInstructor, updateSection);
router.post('/updateSubSection', auth, isInstructor, updateSubSection);
router.post('/deleteSection', auth, isInstructor, deleteSection);
router.post('/deleteSubSection', auth, isInstructor, deleteSubSection);
router.post('/createRating', auth, isStudent, createRating);
router.get('/getAverageRating', auth, getAverageRating);
router.get('/getReviews', auth, getAllRatingReview);
router.post('/updateCourseProgress', auth, isStudent, updateCourseProgress);
router.get('/getCourseDetails', auth, getCourseDetails);
// categories routes
router.post('/createCategory', auth, isAdmin, createCategory);
router.get('/showAllCategories', showAllCategories);
router.post('/getCategoryPageDetails', categoryPageDetails);
// courses
router.get('/getAllCourses', getAllCourses);

