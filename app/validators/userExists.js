const { param } = require('express-validator/check');
const User = require('./../models/User');

const validators = [
    param('userId', 'User must exists')
        .custom(async (value) => await User.findById({ _id: value}) !== null),
];

module.exports = validators;