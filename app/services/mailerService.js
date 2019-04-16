const mailer = require('./../components/mailer');

const send = async (mailOptions) => {
    if (process.env.NODE_ENV === 'production') {
        return mailer.sendMail(mailOptions);
    }
    Promise.resolve();
}

module.exports = {
    send
}