const express = require('express');
const router = express.Router();
const { validate } = require('./../middleware/validator');
const addRoleValidator = require('./../validators/addRole');
const deleteRoleValidator = require('./../validators/deleteRole');
const roleController = require('./../controllers/roleController');

router.get('/', roleController.getRoles);
router.post('/', validate(addRoleValidator), roleController.addRole);
router.delete('/:roleId', validate(deleteRoleValidator), roleController.deleteRole);

module.exports = router;