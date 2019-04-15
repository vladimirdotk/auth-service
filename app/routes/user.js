const express = require('express');
const userController = require('./../controllers/userController');
const { validate } = require('./../middleware/validator');
const userExistsValidator = require('./../validators/userExists');
const createUserValidator = require('./../validators/createUser');
const changeUserValidator = require('./../validators/changeUser');
const confirmValidator = require('./../validators/confirmChangeUser');

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/:userId', validate(userExistsValidator), userController.getUserById);
router.post('/', validate(createUserValidator), userController.createUser);
router.delete('/:userId', validate(userExistsValidator), userController.deleteUser);
router.patch('/:userId', validate(changeUserValidator), userController.changeUser);
router.get('/:userId/confirm-changes', validate(confirmValidator), userController.confirmChanges);

module.exports = router;