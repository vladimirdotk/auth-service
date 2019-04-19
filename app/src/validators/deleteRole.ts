import { param } from 'express-validator/check';
import { Role } from './../models/Role';

export default [
    param('roleId', 'Must exists')
        .custom(async (value: string) => await Role.findById({ _id: value }) !== null),
];
