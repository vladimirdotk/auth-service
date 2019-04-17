const express = require('express');
const { validate } = require('./../middleware/validator');
const userExists = require('./../validators/userExists');
const userSession = require('./../validators/userSession');
const userSessionController = require('./../controllers/userSessionsController');

const router = express.Router();

/**
 * @swagger
 *
 * definitions:
 *   Session:
 *     type: object
 *     required:
 *       - _id
 *       - expires
 *       - session
 *     properties:
 *       _id:
 *         type: string
 *       expires:
 *         type: string
 *       session:
 *         type: string
 */

/**
 * @swagger
 * 
 * /user-sessions/user/{userId}/sessions:
 *   get:
 *     description: Get user sessions
 *     tags:
 *       - user-sessions
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
 *         description: user session
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Session'
 */
router.get('/user/:userId/sessions', validate(userExists), userSessionController.getAll);
router.get('/user/:userId/sessions/:sessionId', validate(userSession), userSessionController.getOne);
router.delete('/users/:userId/sessions', validate(userExists), userSessionController.removeAll);
router.delete('/user/:userId/sessions/:sessionId', validate(userSession), userSessionController.removeOne);

module.exports = router;