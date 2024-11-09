const Profile = require('../models/Profile');
const User = require('../models/user');

const updateProfile = async (req, res) => {
    try {
        // fetch data
        const { dateOfBirth = '', about = '', contactNumber, gender } = req.body;
        // get user id
        const id = req.user.id;
        // validation
        if(!contactNumber || !gender || !id) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }
        // check if user exist
        const userDetails = await User.findById(id);
        if(!userDetails) {
            return res.status(400).json({
                success: false,
                message: 'User not found',
            });
        }
        // check if profile exist
        const profileId = await userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        if(!profileDetails) {
            return res.status(400).json({
                success: false,
                message: 'Profile not found',
            });
        }

        // update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();
        // update user
        //userDetails.additionalDetails = profileDetails._id;
        // return response
        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            updatedProfile,
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while updating the profile',
            error: error.message,
        });
    }
}

// delete Account
const deleteAccount = async (req, res) => {
    try {
        // fetch data
        const id = req.user.id;
        // validation
        const userDetails = await User.findById(id);
        if(!userDetails) {
            return res.status(400).json({
                success: false,
                message: 'User not found',
            });
        }
        // delete profile
        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails});
        // TODO: how to enroll the user from all the courses
        // delete user
        await User.findByIdAndDelete({_id: id});
        // return response
        return res.status(200).json({
            success: true,
            message: 'Account deleted successfully',
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Error while deleting the account',
            error: error.message,
        });
    }
}

// get all user details


module.exports = {
    updateProfile,
    deleteAccount,
}



