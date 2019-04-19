import { query, param } from 'express-validator/check';
import { UserModel } from './../models/User';

export default [
    param('userId', 'User must exists')
        .custom(async (value: string) => await UserModel.findById({ _id: value }) !== null),
    query('confirmCode', 'Bad confirmation code')
        .custom(async (value, { req }) => {
            const user = await UserModel.findById({ _id: req.params.userId });
            return user && user.confirmCode === value;
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
