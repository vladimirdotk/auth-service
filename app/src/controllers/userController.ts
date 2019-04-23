import { Request, Response, NextFunction } from 'express';
import userService from './../services/userService';
import logger from './../components/logger';

export default class UserController {
    static async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await userService.getAll());
        } catch (err) {
            logger.error(`Error geting users: ${err}`);
            next(err);
        }
    }

    static async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await userService.getById(req.params.userId));
        } catch (err) {
            logger.error(`Error geting user with id ${req.params.userId}: ${err}`);
            next(err);
        }
    }

    static async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await userService.create(req.body);
            res.status(201).json(user);
        } catch (err) {
            logger.error(`Error creating user: ${err}`);
            next(err);
        }
    }

    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            await userService.removeById(req.params.userId);
            res.json({ message: 'user deleted' });
        } catch (err) {
            logger.error(`Error deleting user with id ${req.params.userId}: ${err}`);
            next(err);
        }
    }

    static async changeUser(req: Request, res: Response, next: NextFunction) {
        try {
            const confirmUrl = await userService.changeUser({
                userId: req.params.userId,
                protocol: req.protocol,
                hostname: req.hostname,
                port: req.socket.localPort,
                userData: req.body,
            });
            return process.env.NODE_ENV === 'production'
                ? res.json({ message: 'email sent' })
                : res.json({ url: confirmUrl });
        } catch (err) {
            logger.error(`Failed to change user data: ${err}`);
            next(err);
        }
    }

    static async confirmChanges(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await userService.confirmChanges({
                userId: req.params.userId,
                userData: req.query,
            });
            return res.json({ user });
        } catch (err) {
            logger.error(`Error saving user with id ${req.params.userId}: ${err}`);
            next(err);
        }
    }
}
