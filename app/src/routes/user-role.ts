import express = require('express');
import userRolesController from './../controllers/userRolesController';
import { validate } from './../middleware/validator';
import getUserRolesValidator from './../validators/getUserRoles';
import manipulateUserRoleValidator from './../validators/manipulateUserRole';

const router = express.Router();
/**
 * @swagger
 *
 * /user-roles/user/{userId}/roles:
 *   get:
 *     description: Get user roles
 *     tags:
 *       - user-roles
 *     produces:
 *       - application/json
 *     parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *              type: string
 *          required: true
 *     responses:
 *       200:
 *         description: message
 *         schema:
 *             type: object
 *             properties:
 *               userId:
 *                  type: string
 *               roles:
 *                  type: array
 */
router.get('/user/:userId/roles', validate(getUserRolesValidator), userRolesController.get);

/**
 * @swagger
 *
 * /user/roles/user/{userId}/roles/{roleId}:
 *   post:
 *     description: Add user role
 *     tags:
 *       - user-roles
 *     produces:
 *       - application/json
 *     parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *              type: string
 *          required: true
  *        - in: path
 *          name: roleId
 *          schema:
 *              type: string
 *          required: true
 *     responses:
 *       200:
 *         description: user roles
 *         schema:
 *             type: object
 *             properties:
 *               userId:
 *                  type: string
 *               roles:
 *                  type: array
 */
router.post('/user/:userId/role/:roleId', validate(manipulateUserRoleValidator), userRolesController.add);

/**
 * @swagger
 *
 * /user-roles/user/{userId}/roles/{roleId}:
 *   delete:
 *     description: Delete user role
 *     tags:
 *       - user-roles
 *     produces:
 *       - application/json
 *     parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *              type: string
 *          required: true
  *        - in: path
 *          name: roleId
 *          schema:
 *              type: string
 *          required: true
 *     responses:
 *       200:
 *         description: user roles
 *         schema:
 *             type: object
 *             properties:
 *               userId:
 *                  type: string
 *               roles:
 *                  type: array
 */
router.delete('/user/:userId/role/:roleId', validate(manipulateUserRoleValidator), userRolesController.remove);

export default router;
