import { sendMail } from './../components/mailer';
import { SendMailOptions } from 'nodemailer';

export const send = async (mailOptions: SendMailOptions) => {
    if (process.env.NODE_ENV === 'production') {
        return sendMail(mailOptions);
    }
    Promise.resolve();
};
