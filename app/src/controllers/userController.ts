import { Request, Response, NextFunction } from 'express';
import UserService from './../services/userService';
import logger from './../components/logger';

export default class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public getUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await this.userService.getAll());
        } catch (err) {
            logger.error(`Error geting users: ${err}`);
            next(err);
        }
    }

    public getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await this.userService.getById(req.params.userId));
        } catch (err) {
            logger.error(`Error geting user with id ${req.params.userId}: ${err}`);
            next(err);
        }
    }

    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.userService.create(req.body);
            res.status(201).json(user);
        } catch (err) {
            logger.error(`Error creating user: ${err}`);
            next(err);
        }
    }

    public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.userService.removeById(req.params.userId);
            res.json({ message: 'user deleted' });
        } catch (err) {
            logger.error(`Error deleting user with id ${req.params.userId}: ${err}`);
            next(err);
        }
    }

    public changeUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const confirmUrl = await this.userService.changeUser({
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

    public confirmChanges = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.userService.confirmChanges({
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
