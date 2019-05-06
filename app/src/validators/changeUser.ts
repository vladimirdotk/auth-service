import { body, param } from 'express-validator/check';
import UserService from './../services/userService';

const userService = new UserService();

export default [
    param('userId', 'User must exists')
        .custom(async (value: number) => await userService.getById(value)),
    body('name')
        .optional()
        .isLength({ min: 7, max: 50 })
        .withMessage('Must be at least 7 and maximum 50 chars'),
    body('email')
        .optional()
        .isEmail(),
    body('password')
        .optional()
        .isLength({ min: 7, max: 50 })
        .withMessage('Must be at least 7 and maximum 50 chars'),
];
