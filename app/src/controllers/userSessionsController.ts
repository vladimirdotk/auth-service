import { Request, Response, NextFunction } from 'express';
import logger from './../components/logger';
import UserSessionService from './../services/userSessionService';

export default class UserSessionsContorller {
    private userSessionService: UserSessionService;

    constructor() {
        this.userSessionService = new UserSessionService();
    }

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(200).json(await this.userSessionService.getAll(req.params.userId));
        } catch (err) {
            logger.error(`Error getting sessions by user ${req.params.userId}`);
            next(err);
        }
    }

    public getOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await this.userSessionService.getOne(req.params.sessionId);
            res.status(200).json(session);
        } catch (err) {
            logger.error(`Error getting session ${req.params.sessionId} by user ${req.params.userId}`);
            next(err);
        }
    }

    public removeOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.userSessionService.removeOne(req.params.sessionId);
            res.json({ message : 'success' });
        } catch (err) {
            logger.error(`Error deleting session ${req.params.sessionId} by userId ${req.params.userId}`);
            next(err);
        }
    }

    public removeAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const nums = this.userSessionService.removeAll(req.params.userId);
            res.json({ message : 'success' });
        } catch (err) {
            logger.error(`Error deleting sessions by userId ${req.params.userId}`);
            next(err);
        }
    }
}
