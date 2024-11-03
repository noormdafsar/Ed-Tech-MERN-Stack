const mongoose = require('mongoose');
const { Schema } = mongoose;
const mailSender = require('../utils/mailSender');

const OTPSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5*60 ,
    },
});

//logic for sending email
const sendEmailVerification = async (email, otp) => {
    try {
        const mailResponse = await mailSender(email, 'Verification Email', emailTemplate(otp));
        console.log('Email sent successfully...!!!', mailResponse.response);
    }
    catch(error) {
        console.log(error);
        throw new Error('ERROR while sending the mail',error.message);
    }
}

OTPSchema.pre('save',async function(next) {
    console.log('New document saved to database');
    // Only send an email when a new document is created
    await sendEmailVerification(this.email, this.otp);
    next();
})

module.exports = mongoose.model('Otp', OTPSchema);