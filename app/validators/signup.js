const { body } = require('express-validator/check');

const validators = [
    body('name')
        .isLength({min: 7, max: 50})
        .withMessage('Must be at least 7 and maximum 50 chars'),
    body('email')
        .isEmail(),
    body('password')
        .isLength({min: 7, max: 50})
        .withMessage('Must be at least 7 and maximum 50 chars'),
    body('password2')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Must be the same as password')
];

module.exports = validators;