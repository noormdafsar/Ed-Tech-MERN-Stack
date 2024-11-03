const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();

// isAuth 

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token || req.headers('Authorisation').replace('Bearer', '');
        // check if token is present
        if(!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is missing',
            });
        }
        // verify the token
        const decodedMessage = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedMessage;
        const user = await User.findById(_id);
        if(!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found',
            });
        }
        req.user = user;
        next();
    }
    catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'User is not authenticated',
        });
    }
}

// isAdmin authentication
const adminAuth = async (req, res) => {
    try {
        if(req.user.accountType !== 'Admin') {
            return res.status(400).json({
                success: false,
                message: 'This is a protected route for admin',
            });
        }
    }
    catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'User is not authenticated',
        });
    }
}

// isStudent authentication


// isInstructor authentication

module.exports = {
    userAuth,
};