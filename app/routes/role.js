const express = require('express');
const router = express.Router();
const { validate } = require('./../middleware/validator');
const addRoleValidator = require('./../validators/addRole');
const deleteRoleValidator = require('./../validators/deleteRole');
const roleController = require('./../controllers/roleController');

/**
 * @swagger
 *
 * definitions:
 *   Role:
 *     type: object
 *     required:
 *       - _id
 *       - name
 *     properties:
 *       _id:
 *         type: string
 *       name:
 *         type: string
 */

/**
 * @swagger
 * 
 * /roles:
 *   get:
 *     description: Returns roles
 *     tags:
 *       - roles
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: roles
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Role'
 */
router.get('/', roleController.getRoles);

/**
 * @swagger
 *
 * /roles:
 *   post:
 *     description: Creates a role
 *     tags:
 *       - roles
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: role
 *         description: role name
 *         in:  body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: role
 *         schema:
 *           $ref: '#/definitions/Role'
 */
router.post('/', validate(addRoleValidator), roleController.addRole);

/**
 * @swagger
 *
 * /roles:
 *   delete:
 *     description: Deletes a role
 *     tags:
 *       - roles
 *     produces:
 *       - application/json
 *     parameters:
 *       - _id: role
 *         description: role id
 *         in:  body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: message
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 */
router.delete('/:roleId', validate(deleteRoleValidator), roleController.deleteRole);

module.exports = router;