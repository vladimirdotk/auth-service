import { query, param } from 'express-validator/check';
import UserService from './../services/userService';

const userService = new UserService();

export default [
    param('userId', 'User must exists')
        .custom(async (value: number) => await userService.getById(value)),
    query('confirmCode', 'Bad confirmation code')
        .custom(async (value, { req }) => {
            const user = await userService.getById(req.params.userId);
            return user.confirmCode === value;
        }),
    query('name')
        .optional()
        .isLength({ min: 7, max: 50 })
        .withMessage('Must be at least 7 and maximum 50 chars'),
    query('email')
        .optional()
        .isEmail(),
    query('password')
        .optional()
        .isLength({ min: 7, max: 50 })
        .withMessage('Must be at least 7 and maximum 50 chars'),
];
