const { validationResult } = require('express-validator/check');
const { UNPROCESSABLE_ENTITY } = require('http-status-codes');

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const validationError = new Error('Validation error');
        validationError.status = UNPROCESSABLE_ENTITY;
        validationError.details = errors.array();
        return next(validationError);
    }

    next();
}

const validate = (validator) => {
    return [
        validator,
        validationMiddleware
    ]
}

module.exports = {
    validate
}