const mailer = require('nodemailer');

const transporter = mailer.createTransport({
    service: process.env.MAILER_SERVICE,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    }
});

const sendMail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(`Error sending email: ${error}`);
                reject('Fail to send email');
                return;
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            resolve('Success');
        });
    })
}

module.exports = {
    sendMail
};