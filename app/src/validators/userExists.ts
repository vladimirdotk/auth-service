import { param } from 'express-validator/check';
import UserService from './../services/userService';

const userService = new UserService();

export default [
    param('userId', 'User must exists')
        .custom(async (value: number) => await userService.getById(value) !== null),
];
