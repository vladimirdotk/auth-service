const { body, param } = require('express-validator/check');
const User = require('./../models/User');

const validators = [
    param('userId', 'User must exists')
        .custom(async (value) => await User.findById({ _id: value}) !== null),
    body('name')
        .optional()
        .isLength({min: 7, max: 50})
        .withMessage('Must be at least 7 and maximum 50 chars'),
    body('email')
        .optional()
        .isEmail(),
    body('password')
        .optional()
        .isLength({min: 7, max: 50})
        .withMessage('Must be at least 7 and maximum 50 chars'),
];

module.exports = validators;