const url = require('url');
const { NOT_FOUND } = require('http-status-codes');
const utils = require('./../utils');
const User = require('./../models/User');
const mailerService = require('./../services/mailerService');

const confirmText = 'Please confirm user data changes';

const checkUser = (user) => {
    if (!user) {
        const error = new Error('User not found');
        error.status = NOT_FOUND;
        throw error;
    }
}

const createConfirmUrl = (data) => {
    return url.format({
        protocol: data.protocol,
        hostname: data.hostname,
        port: data.port,
        pathname: `/users/${data.userId}/confirm-changes`,
        query: Object.assign(data.userData, { confirmCode: data.confirmCode })
    });
}

const createConfirmMailOptions = (email, confirmUrl) => {
    return {
        from: process.env.MAILER_EMAIL,
        to: email,
        subject: confirmText,
        text: `${confirmText}: ${confirmUrl}`,
        html: `<div>${confirmText}: ${confirmUrl}</div>`
    };
}

const getAll = async () => {
    return User.find();
}

const getById = async (userId) => {
    const user = await User.findOne({ _id: userId });
    checkUser(user);
    return user;
}

const create = async (data) => {
    return User.createUser(data);
}

const removeById = async (userId) => {
    const user = await User.findById({ _id: userId });
    checkUser(user);
    return user.remove();
}

const changeUser = async (data) => {
    const user = await User.findById({ _id: data.userId });
    checkUser(user);
    user.confirmCode = utils.getRandomName();
    await user.save();
    const confirmUrl = createConfirmUrl(Object.assign(data, { confirmCode: user.confirmCode }));
    const mailOptions = createConfirmMailOptions(user.email, confirmUrl);
    await mailerService.send(mailOptions);
    return confirmUrl;
}

const confirmChanges = async (data) => {
    let user = await User.findById({ _id: data.userId });
    checkUser(user);
    user = Object.assign(user, data.userData, { confirmCode: null })
    await user.save();
    return user;
}

module.exports = {
    getAll,
    getById,
    create,
    removeById,
    changeUser,
    confirmChanges
}