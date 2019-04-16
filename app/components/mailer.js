const mailer = require('nodemailer');
const logger = require('./../components/logger');

const transporter = mailer.createTransport({
    service: process.env.MAILER_SERVICE,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    }
});

const sendMail = async (mailOptions) => {
    const info = await transporter.sendMail(mailOptions);
    logger.debug('Message %s sent: %s', info.messageId, info.response);
}

module.exports = {
    sendMail
};