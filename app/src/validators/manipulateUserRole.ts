import { param } from 'express-validator/check';
import UserService from './../services/userService';
import RoleService from './../services/roleService';

const userService = new UserService();
const roleService = new RoleService();

export default [
    param('userId', 'User must exists')
        .custom(async (value: number) => await userService.getById(value)),
    param('roleId', 'Role must exists')
        .custom(async (value: number) => await roleService.getById(value)),
];
