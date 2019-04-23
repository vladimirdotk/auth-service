import { Request, Response, NextFunction } from 'express';
import userRoleService from './../services/userRoleService';
import logger from './../components/logger';

export default class UserRolesController {
    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await userRoleService.getAll(req.params.userId));
        } catch (err) {
            logger.error(`Error geting user ${req.params.userId} services: ${err}`);
            next(err);
        }
    }

    static async add(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await userRoleService.add(req.params.userId, req.params.roleId));
        } catch (err) {
            logger.error(`Error adding role ${req.params.roleId} to user ${req.params.userId}: ${err}`);
            next(err);
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await userRoleService.remove(req.params.userId, req.params.roleId));
        } catch (err) {
            logger.error(`Error deleting role ${req.params.roleId} from user ${req.params.userId}: ${err}`);
            next(err);
        }
    }
}
