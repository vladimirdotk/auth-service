import { param } from 'express-validator/check';
import UserService from './../services/userService';
import SessionService from './../services/userSessionService';

const userService = new UserService();
const sessionService = new SessionService();

export default [
    param('userId', 'User must exists')
        .custom(async (value: number) => await userService.getById(value)),
    param('sessionId', 'Session must exists')
        .custom(async (value: string) => await sessionService.getOne(value)),
];
