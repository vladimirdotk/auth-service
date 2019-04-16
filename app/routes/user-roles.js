const express = require('express');
const userRolesController = require('./../controllers/userRolesController');
const { validate } = require('./../middleware/validator');
const getUserRolesValidator = require('./../validators/getUserRoles');
const manipulateUserRoleValidator = require('./../validators/manipulateUserRole');

const router = express.Router();

router.get('/user/:userId/roles', validate(getUserRolesValidator), userRolesController.get);
router.post('/user/:userId/role/:roleId',validate(manipulateUserRoleValidator), userRolesController.add);
router.delete('/user/:userId/role/:roleId', validate(manipulateUserRoleValidator), userRolesController.remove);

module.exports = router;