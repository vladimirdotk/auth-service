const express = require('express');
const userController = require('./../controllers/userController');
const { validate } = require('./../middleware/validator');
const userExistsValidator = require('./../validators/userExists');
const createUserValidator = require('./../validators/createUser');
const changeUserValidator = require('./../validators/changeUser');
const confirmValidator = require('./../validators/confirmChangeUser');

const router = express.Router();

/**
 * @swagger
 *
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - _id
 *       - name
 *       - email
 *     properties:
 *       _id:
 *         type: string
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       roles:
 *         type: array
 */

/**
 * @swagger
 * 
 * /users:
 *   get:
 *     description: Returns users
 *     tags:
 *       - users
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: users
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/User'
 */
router.get('/', userController.getUsers);

/**
 * @swagger
 * 
 * /users/{userId}:
 *   get:
 *     description: Returns user
 *     tags:
 *       - users
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
 *         description: user
 *         schema:
 *             $ref: '#/definitions/User'
 */
router.get('/:userId', validate(userExistsValidator), userController.getUserById);

/**
 * @swagger
 * 
 * /users:
 *   post:
 *     description: Creates user
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     parameters:
 *        - in: body
 *          name: name
 *          schema:
 *              type: string
 *          required: true
 *          description: Name must be at least 7 and maximum 50 chars
 *        - in: body
 *          name: email
 *          schema:
 *              type: string
 *          required: true
 *          description: Must be a valid email
 *        - in: body
 *          name: password
 *          schema:
 *              type: string
 *          required: true
 *          description: Password must be at least 7 and maximum 50 chars
 *     responses:
 *       200:
 *         description: user
 *         schema:
 *             $ref: '#/definitions/User'
 */
router.post('/', validate(createUserValidator), userController.createUser);

/**
 * @swagger
 * 
 * /users/{userId}:
 *   delete:
 *     description: Deletes user
 *     tags:
 *       - users
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
 *               message: 
 *                  type: string
 */
router.delete('/:userId', validate(userExistsValidator), userController.deleteUser);

/**
 * @swagger
 * 
 * /users/{userId}:
 *   patch:
 *     description: Changes user
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *              type: string
 *          required: true
 *        - in: body
 *          name: name
 *          schema:
 *              type: string
 *          required: false
 *          description: Name must be at least 7 and maximum 50 chars
 *        - in: body
 *          name: email
 *          schema:
 *              type: string
 *          required: false
 *          description: Must be a valid email
 *        - in: body
 *          name: password
 *          schema:
 *              type: string
 *          required: false
 *          description: Password must be at least 7 and maximum 50 chars 
 *     responses:
 *       200:
 *         description: message
 *         schema:
 *             type: object
 *             properties:
 *               message: 
 *                  type: string
 */
router.patch('/:userId', validate(changeUserValidator), userController.changeUser);

/**
 * @swagger
 * 
 * /users/{userId}/confirm-changes:
 *   get:
 *     description: Confirm user changes
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *              type: string
 *          required: true
 *        - in: query
 *          name: name
 *          schema:
 *              type: string
 *          required: false
 *          description: Name must be at least 7 and maximum 50 chars
 *        - in: query
 *          name: email
 *          schema:
 *              type: string
 *          required: false
 *          description: Must be a valid email
 *        - in: query
 *          name: password
 *          schema:
 *              type: string
 *          required: false
 *          description: Password must be at least 7 and maximum 50 chars 
 *        - in: query
 *          name: confirmCode
 *          schema:
 *              type: string
 *          required: true
 *          description: Confirm code
 *     responses:
 *       200:
 *         description: message
 *         schema:
 *             type: object
 *             properties:
 *               message: 
 *                  type: string
 */
router.get('/:userId/confirm-changes', validate(confirmValidator), userController.confirmChanges);

module.exports = router;