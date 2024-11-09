const User = require('../models/user');
const Profile = require('../models/Profile');
const Otp = require('../models/Otp');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const mailSender = require('../utils/mailSender');




// Signup
const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, accountType, otp, } = req.body;
        // check if all fields are present
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            });
        }
        // check if user already exist
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exist with this email',
            });
        }
        // check if password and confirm password match
        if(password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password and confirm password do not match',
            });
        }

        // find the most recent otp stored in db for user
        const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        // validate otp
        if(recentOtp.length == 0 ) {
            return res.status(400).json({
                success: false,
                message: 'OTP Not Found',
            });
        }
        else if(otp !== recentOtp.otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // save the user in db

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails,
            image: `https://api.dicebear.com/6.x/initials/svg?seed=${firstName} ${lastName}`,
        });
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'Signup successfully',
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error while signing up',
        });
    }
}


// Login

const login = async ( req, res ) => {
    try {
        // fetch email and password from req.body
        const { email, password } = req.body;
        // check if email and password are present
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and Password are required',
            });
        }
        // check if user exist
        const user = await User.findOne({ email }).populate('additionalDetails');
        if(!user) {
            return res.status(400).json({
                success: false,
                message: 'User is not registered with this email so please signup to continue',
            });
        }
        // crete a jwt token and compare the password
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid) {
            const token = await user.getJWT();
            // set the cookie and send the response
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
                httpOnly: true,
              });
              res.status(200).json({
                success: true,
                message: 'User logged in successfully',
                token,
                user,
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
        });
    }

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error while logging in',
        });
    }
}

// Send OTP
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        // check if user already exist
        const user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({
                success: false,
                message: 'User already exist with this email',
            });
        }
        // generate OTP
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        console.log('OTP:', otp);
        
        // check if OTP already exist
        const existingOtp = await Otp.findOne({ email });
        if(existingOtp) {
            await Otp.findOneAndUpdate({ email }, { otp });
        }
        
        // create an entry for OTP
        const otpPayload = { email, otp };
        const otpBody = await Otp.create(otpPayload);
        console.log('OTP Body:', otpBody);

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({ 
            success: false,
            message: 'Error while sending OTP', 
        });
    }
}

// changePassword
const changePassword = async (req, res) => {
    try {
        // fetch user data from req.body
        const userDetails = await User.findOne({ _id: req.user.id });
        // get old password and new password from req.body
        const { oldPassword, newPassword } = req.body;
        // validate old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
        if(!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'This is an invalid old password',
            });
        }
        // hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // update the password
       const updatedUserDetails = await User.findOneAndUpdate(
        { _id: req.user.id }, 
        { password: hashedPassword },
        { new: true },
        );
        return res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
        // send email for password change
        try {
            const emailResponse = await mailSender(
                'Password for your account has been updated',
                updatedUserDetails.email,
                updatedPassword(updatedUserDetails.email, 
                    `${updatedUserDetails.firstName}` `${updatedUserDetails.lastName} Your password updated successfully`,),
            );
            console.log('Email sent successfully: ', emailResponse);
            return
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Error while sending email',
            });
        }
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error while changing password',
        });
    }
}

module.exports = { 
    signup, login, sendOTP, changePassword,
};