import { Request, Response, NextFunction } from 'express';
import UserRoleService from './../services/userRoleService';
import logger from './../components/logger';

export default class UserRolesController {
    private userRoleService: UserRoleService;

    constructor() {
        this.userRoleService = new UserRoleService();
    }

    public get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await this.userRoleService.getAll(req.params.userId));
        } catch (err) {
            logger.error(`Error geting user ${req.params.userId} services: ${err}`);
            next(err);
        }
    }

    public add = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await this.userRoleService.add(req.params.userId, req.params.roleId));
        } catch (err) {
            logger.error(`Error adding role ${req.params.roleId} to user ${req.params.userId}: ${err}`);
            next(err);
        }
    }

    public remove = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await this.userRoleService.remove(req.params.userId, req.params.roleId));
        } catch (err) {
            logger.error(`Error deleting role ${req.params.roleId} from user ${req.params.userId}: ${err}`);
            next(err);
        }
    }
}
