import { param } from 'express-validator/check';
import { UserModel } from './../models/User';
import { Session } from './../models/Session';

export default [
    param('userId', 'User must exists')
        .custom(async (value: string) => await UserModel.findById({ _id: value }) !== null),
    param('sessionId', 'Session must exists')
        .custom(async (value: string) => await Session.findById({ _id: value }) !== null),
];
