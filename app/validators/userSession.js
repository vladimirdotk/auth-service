const { param } = require('express-validator/check');
const User = require('./../models/User');
const Session = require('./../models/Session');

const validators = [
    param('userId', 'User must exists')
        .custom(async (value) => await User.findById({ _id: value}) !== null),
    param('sessionId', 'Session must exists')
        .custom(async (value) => await Session.findById({ _id: value !== null}))
];

module.exports = validators;