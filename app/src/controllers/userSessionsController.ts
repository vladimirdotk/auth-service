import { Request, Response, NextFunction } from 'express';
import logger from './../components/logger';
import userSessionService from './../services/userSessionService';

export default class UserSessionService {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(await userSessionService.getAll(req.params.userId));
        } catch (err) {
            logger.error(`Error getting sessions by user ${req.params.userId}`);
            next(err);
        }
    }

    static async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const session = await userSessionService.getOne(req.params.userId, req.params.sessionId);
            res.status(200).json(session);
        } catch (err) {
            logger.error(`Error getting session ${req.params.sessionId} by user ${req.params.userId}`);
            next(err);
        }
    }

    static async removeOne(req: Request, res: Response, next: NextFunction) {
        try {
            await userSessionService.removeOne(req.params.userId, req.params.sessionId);
            res.json({ message : 'success' });
        } catch (err) {
            logger.error(`Error deleting session ${req.params.sessionId} by userId ${req.params.userId}`);
            next(err);
        }
    }

    static async removeAll (req: Request, res: Response, next: NextFunction) {
        try {
            await userSessionService.removeAll(req.params.userId);
            res.json({ message : 'success' });
        } catch (err) {
            logger.error(`Error deleting sessions by userId ${req.params.userId}`);
            next(err);
        }
    }
}
