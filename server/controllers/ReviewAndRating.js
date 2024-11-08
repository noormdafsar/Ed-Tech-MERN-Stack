const ReviewAndRating = require('../models/ReviewAndRating');
const Course = require('../models/Course');
const User = require('../models/user');


// const createRating = async (req, res) => {
//     try {
//         // get user info
//         const userId = req.user.id;
//         const { rating, review, courseId } = req.body;
//         // check if user is enrolled or not
//         const courseDetails = await Course.findOne({
//             _id: courseId,
//             studentsEnrolled: { $elemMatch: { $eq: userId } },
//         });
//         if(!courseDetails) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Student is not enrolled in the course',
//             });
//         }
//         // check if user already reviewed the course
//         const alreadyReviewed = await ReviewAndRating.findOne({
//             user: userId,
//             course: courseId,
//         });
//         if(alreadyReviewed) {
//             return res.status(403).json({
//                 success: false,
//                 message: 'Course is already reviewed by the user',
//             });
//         }
//         // create the review and rating
//         const ratingReview = await ReviewAndRating.create({
//             rating,
//             review,
//             course: courseId,
//             user: userId,
//         });
//         // update the course with this rating and review
//         const updatedCourseDetails = await Course.findByIdAndUpdate({
//             _id: courseId,
//         },
//         {
//             $push: {
//                 ratingAndReviews: ratingReview._id,
//             }
//             { new: true },
//     });
//     return res.status(200).json({
//         success: true,
//         message: 'Rating and review created successfully',
//         ratingReview,
//     });
// }
// catch(error) {
//     return res.status(500).json({
//         success: false,
//         message: 'Error while creating the rating and review',
//         error: error.message,
//     });
// }
// }

const createRating = async ( req, res ) => {
    try {
        // get user info
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;
        // check if user is enrolled or not
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } },
        });
        if(!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Student is not enrolled in the course',
            });
        }
        // check if user already reviewed the course
        const alreadyReviewed = await ReviewAndRating.findOne({
            user: userId,
            course: courseId,
        });
        if(alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: 'Course is already reviewed by the user',
            });
        }
        // create the review
        const ratingReview = await ReviewAndRating.create({
            rating,
            review,
            course: courseId,
            user: userId,
        });
        // update the course with this rating and review
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    ratingAndReviews: ratingAndReviews._id,
                }
            },
            { new: true },
        )
        return res.status(200).json({
            success: true,
            message: 'Rating and review created successfully',
            ratingReview,
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while creating the rating and review',
        })
    }
}



module.exports = {
    createRating,
}