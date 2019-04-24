import express = require('express');
import { validate } from './../middleware/validator';
import addRoleValidator from './../validators/addRole';
import deleteRoleValidator from './../validators/deleteRole';
import RoleController from './../controllers/roleController';

const router = express.Router();

const roleController = new RoleController();

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
 * /roles{roleId}:
 *   delete:
 *     description: Deletes a role
 *     tags:
 *       - roles
 *     produces:
 *       - application/json
 *     parameters:
 *       - roleId: role
 *         description: role id
 *         in:  path
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

export default router;
