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
            message: 'Error while resetting the password',
        });
    }
}

// reset password

module.exports = resetPasswordToken;