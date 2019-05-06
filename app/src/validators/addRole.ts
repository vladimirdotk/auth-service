import { body } from 'express-validator/check';
import RoleService from './../services/roleService';

const roleService = new RoleService();

export default [
    body('name', 'Must be at least 3 and not more than 50 chars')
        .isLength({ min: 3, max: 50 }),
    body('name', 'Must be unique')
        .custom(async (value: string) => await roleService.getOneByName(value) === undefined),
];
