const { query, param } = require('express-validator/check');
const User = require('./../models/User');

const validators = [
    param('userId', 'User must exists')
        .custom(async (value) => await User.findById({ _id: value}) !== null),
    query('confirmCode', 'Bad confirmation code')
        .custom(async (value, { req }) => {
            const user = await User.findById({ _id: req.params.userId });
            return user && user.confirmCode === value
        }),
    query('name')
        .optional()
        .isLength({min: 7, max: 50})
        .withMessage('Must be at least 7 and maximum 50 chars'),
    query('email')
        .optional()
        .isEmail(),
    query('password')
        .optional()
        .isLength({min: 7, max: 50})
        .withMessage('Must be at least 7 and maximum 50 chars'),
];

module.exports = validators;