import { param } from 'express-validator/check';
import RoleService from './../services/roleService';

const roleService = new RoleService();

export default [
    param('roleId', 'Must exists')
        .custom(async (value: number) => await roleService.getById(value) !== null),
];
