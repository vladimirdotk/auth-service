import { body } from 'express-validator/check';

export default [
    body('name')
        .isLength({ min: 7, max: 50 })
        .withMessage('Must be at least 7 and maximum 50 chars'),
    body('email')
        .isEmail(),
    body('password')
        .isLength({ min: 7, max: 50 })
        .withMessage('Must be at least 7 and maximum 50 chars'),
];
