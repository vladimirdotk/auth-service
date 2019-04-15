const { body } = require('express-validator/check');

const validators = [
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