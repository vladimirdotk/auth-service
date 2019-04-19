import { param } from 'express-validator/check';
import { UserModel } from './../models/User';
import { Role } from './../models/Role';

export default [
    param('userId', 'User must exists')
        .custom(async (value: string) => await UserModel.findById({ _id: value }) !== null),
    param('roleId', 'Role must exists')
        .custom(async (value: string) => await Role.findById({ _id: value }) !== null),
];
