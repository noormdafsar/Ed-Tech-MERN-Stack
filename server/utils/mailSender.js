const nodemailer = require('nodemailer');
const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        let info = await transporter.sendMail({
            from: `Ed-Tech Noor || StudyNotion <${process.env.MAIL_USER}>`, // sender address
            to: `${email}`, // receiver email
            subject: `${title}`, // Subject line
            html: `${body}` // html body
        });
        console.log(info.response);
        return info;

    }
    catch(error) {
        console.log(error);
        throw new Error('ERROR while sending the mail',error.message);
    }
}

module.exports = mailSender;