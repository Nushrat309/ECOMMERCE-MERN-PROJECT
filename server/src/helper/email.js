const nodemailer = require('nodemailer');
const { smtpUsername, smtpPassword } = require('../secret');
const logger = require('../controllers/loggerContoller');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
        user: smtpUsername,
        pass: smtpPassword
    },
});

const emailWithNodeMailer = async (emailData) => {
try{
    const mailOptions = {
    from: smtpUsername,
    to: emailData.email,
    subject: emailData.subject,
    html: emailData.html,
 };

 const info = await transporter.sendMail(mailOptions);
 logger.log('info','message sent:%s', info.response);
} catch(error){
    logger.log('error','Error occured while sending email:',error);
    throw error;
}
};

module.exports = emailWithNodeMailer;