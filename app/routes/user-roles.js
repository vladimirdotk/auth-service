const express = require('express');
const userRolesController = require('./../controllers/userRolesController');
const { validate } = require('./../middleware/validator');
const getUserRolesValidator = require('./../validators/getUserRoles');
const manipulateUserRoleValidator = require('./../validators/manipulateUserRole');

const router = express.Router();

router.get('/user/:userId/roles', validate(getUserRolesValidator), userRolesController.getUserRoles);
router.post('/user/:userId/role/:roleId',validate(manipulateUserRoleValidator), userRolesController.addUserRole);
router.delete('/user/:userId/role/:roleId', validate(manipulateUserRoleValidator), userRolesController.deleteUserRole);

module.exports = router;