import * as mailer from 'nodemailer';
import logger from './../components/logger';

const transporter = mailer.createTransport({
    service: process.env.MAILER_SERVICE,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
    },
});

export const sendMail = async (mailOptions: mailer.SendMailOptions) => {
    const info = await transporter.sendMail(mailOptions);
    logger.debug('Message %s sent: %s', info.messageId, info.response);
};
