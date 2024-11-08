const { instance } = require('../config/razorpay');
const user  = require('../models/user');
const Course = require('../models/Course');
const mailSender = require('nodemailer');
const { courseEnrollment } = require('../mailTempletes/courseEnrollment');
require('dotenv').config();

const capturePayment = async ( req, res ) => {
    try {
        // get the coureId and userId from the request body
        const { courseId } = req.body;
        const userId = req.user.id;
        // validation
        if( !courseId || !userId ) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }
        // valid courseDetails
        try{
            const courseDetails = await Course.findById(courseId);
            if(!courseDetails_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Course not found',
                });
            }
            // if user already purchased the course
            const uid = new mongoose.Types.ObjectId(userId);
            if(courseDetails.studentsEnrolled.includes(uid)) {
                return res.status(400).json({
                    success: false,
                    message: 'You have already purchased the course',
                });
            }
        }
        catch(error) {
            return res.status(500).json({
                success: false,
                message: 'Error while fetching course details' +error.message,
            });
        }
        // create an order
        const amount  = courseDetails.price;
        const currency = 'INR';
        const options = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.now().toString()),
            notes: {
                courseId: courseId,
                userId: userId,
            },
        }
        try{
            // initiate the payment
            const paymentResnonse = await instance.orders.create(options);
            console.log(paymentResnonse);
            // send the payment link to the user
            const paymentLink = paymentResnonse.payment_url;
           return res.status(200).json({
                success: true,
                courseName: courseDetails.name,
                courseDescription: courseDetails.description,
                userId: userId,
                orderId: paymentResnonse.id,
                currency: paymentResnonse.currency,
                amount: paymentResnonse.amount,
                message: 'Payment initiated successfully',
                paymentLink,
                });

        }
        catch(error) {
            return res.status(500).json({
                success: false,
                message:'Error while creating the order' +error.message,
            }); 
        }
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while initiating the payment' +error.message,
        });
    }
}

const verifyPayment = async ( req, res ) => {
    try {
        const webhookSecret = process.env.WEBHOOK_SECRET;
        const signature = req.headers['x-razorpay-signature'];
        
        const shasum = crypto.createHmac('sha256', webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');
        if(digest !== signature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request signature',
            });
        }
        else {
            try {
                // full fill the action
                // userId to course enrollment
                const enrolledCourse = await Course.findByIdAndUpdate(
                                                    { _id:courseId },
                                                    { $push: { studentsEnrolled: userId } },
                                                    { new: true },
                );
                if(!enrolledCourse) {
                    return res.status.json({
                        success: false,
                        message: 'Course not found',
                    });
                }
                // send the email to the user
                const mailResponse = await mailSender.sendMail(
                                    enrolledStudent.email,
                                    courseEnrollment(enrolledCourse.name, enrolledCourse.description),
                                    'Congralutations! from Ed-tech platform',
                                    'Congratulations!, you are onboarded into the new course',
                )
                console.log(mailResponse);
                return res.status(200).json({
                    success: true,
                    message: 'Payment verified successfully',
                });

            }
            catch(error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error while enrollment' +error.message,
                });
            }
        }
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while verifying the payment' +error.message,
        });
    }
}


module.exports = {
    capturePayment, verifyPayment,
}