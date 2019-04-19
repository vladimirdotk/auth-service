import { body } from 'express-validator/check';
import { Role } from './../models/Role';

export default [
    body('name', 'Must be at least 3 and not more than 50 chars')
        .isLength({ min: 3, max: 50 }),
    body('name', 'Must be unique')
        .custom(async (value: string) => await Role.findOne({ name: value }) === null),
];
