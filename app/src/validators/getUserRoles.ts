import { param } from 'express-validator/check';
import { UserModel } from './../models/User';

export default [
    param('userId', 'User must exists')
        .custom(async (value: string) => await UserModel.findById({ _id: value }) !== null),
];
