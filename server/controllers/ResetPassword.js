const User = require('../models/user');
const mailSender = require('../utils/mailSender');


const resetPasswordToken = async (req, res) => {
    try {
        // get email from request body
        const { email } = req.body;
        //  check if user exist with this email
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                success: false,
                message: 'User does not exist with this email',
            });
        }
        // generate token
        const token = crypto.randomUUID();

        //  update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            { email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            { new: true }
        );

        //  create url
        const url = `http://localhost:5173/update-password/${token}`;

        //  send mail containing the token
        await mailSender(
            email,
            "Password Reset Link",
            `Password Reset Link: ${url}`
        );
        //  return response
        return res.status(200).json({
            success: true,
            message: 'Email sent successfully, please check email and change password',
        }); 
    }
    catch(error ) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error while resetting the password token',
        });
    }
}

// reset password
const resetPassword = async (req, res) => {
    try {
        // fetch data
        const { password, confirmPassword, token } = req.body;
        // validation
        if(password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password and confirm password do not match',
            });
        }
        // get user details from db using token
        const userDetails = await User.findOne({ token: token });
        // if no entry, invalid token
        if(!userDetails) {
            return res.status(400).json({
                success: false,
                message: 'Token is invalid',
            });
        }
        // check token time
        if(userDetails.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Token is expired, please regenerate your token',
            });
        }
        // hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        // update password
        await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword },
            { new: true }
        );
        // send email
        await mailSender(
            userDetails.email,
            'Password Reset Successful',
            'Password Reset Successfully'
        );
        // save in db
        await userDetails.save();
        // return response
        return res.status(200).json({
            success: true,
            message: 'Password reset successfully...!!!',
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error while resetting the password',
        });
    }
}

module.exports = {
    resetPasswordToken, resetPassword
};