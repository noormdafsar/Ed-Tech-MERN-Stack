const Course = require('../models/Course');
const User = require('../models/user');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const Category = require('../models/Category');
// const Tag = require('../models/Tag');

const creatCourse = async (req, res) => {
    try {
        // fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, category, thumbnail } = req.body;
        // get thumbnail
        const thumbnailImage = req.files.thumbnailImage;
        // validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnailImage) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }
        // fetch user details
        const userId = req.user.id;
        const userDetails = await User.findById(userId);
        // check if user is instructor
        if(userDetails.accountType !== 'instructor') {
            return res.status(400).json({
                success: false,
                message: 'Only instructor can create the course',
            });
        }
        // check if course already exist
        const courseExist = await Course.findOne({ courseName });
        if(courseExist) {
            return res.status(400).json({
                success: false,
                message: 'Course already exist',
            });
        }
        // check if categories exist
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails) {
            return res.status(400).json({
                success: false,
                message: 'Category does not exist',
            });
        }
        // upload thumbnail to cloudinary
        const thumbnailDetails = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn: whatYouWillLearn,
            price,
            // tag: tagDetails._id,
            category: categoryDetails._id,
            instructor: userDetails._id,
            thumbnail: thumbnailDetails.secure_url,
        });
        // add new course to the user instructor schema courses array
        const updatedUserDetails = await User.findByIdAndUpdate(
            { 
                _id: userDetails._id,
            }, 
            {
            $push: {
                courses: newCourse._id,
            }
        },
        { new: true }
    );
    console.log('Updated User Details: ', updatedUserDetails)
    // update the category schema
    const updatedCategoryDetails = await Category.findByIdAndUpdate(
        {
            _id: categoryDetails._id,
        },
        {
            $push: {
                courses: newCourse._id,
            }
        },
        { new: true }
    );
    console.log('Updated Category Details:', updatedCategoryDetails);
    return res.status(200).json({
        success: true,
        message: 'New Course created successfully...!!!',
        data: newCourse,
    });

    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while creating the course',
        });
    }
}

// get all courses or show all courses
const showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {
            courseName: true,
            courseDescription: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            category: true,
            studentsEnrolled: true,
        }).populate('instructor').exec();
        return res.status(200).json({
            success: true,
            message: 'All courses fetched successfully',
            data: allCourses,
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while fetching all the courses',
        });
    }
}

const getCourseDetails = async (req, res) => {
    try {
        // get course id
        const { courseId } = req.body;
        // get course details
        const courseDetails = await Course.findById(
                                        {_id:courseId})
                                        .populate(
                                            {
                                                path: 'instructor',
                                                populate: {
                                                    path: 'additionalDetails',
                                                },
                                            }
                                        )
                                        .populate('category')
                                        .populate(
                                            {
                                                path: 'ratingAndReviews',
                                                populate: {
                                                    path: 'user',
                                                },
                                            }
                                        )
                                        .populate(
                                            {
                                                path: 'courseContent',
                                                populate: {
                                                    path: 'subSection',
                                                },
                                            }
                                        )
                                       .exec();
        // validation
        if(!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Course details fetched successfully',
            data: courseDetails,
        });

    }
    catch(error) {

    }
}

module.exports = {
    creatCourse,
    showAllCourses,
    getCourseDetails,
}