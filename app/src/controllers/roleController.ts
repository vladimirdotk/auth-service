import logger from './../components/logger';
import { Request, Response, NextFunction } from 'express';
import RoleService from './../services/roleService';

export default class RoleController {
    private roleService: RoleService;

    constructor() {
        this.roleService = new RoleService();
    }

    public getRoles = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await this.roleService.getAll());
        } catch (err) {
            logger.error(`Error getting roles: ${err}`);
            next(err);
        }
    }

    public addRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(201).json(await this.roleService.create(req.body.name));
        } catch (err) {
            logger.error(`Error creating a role: ${err}`);
            next(err);
        }
    }

    public deleteRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.roleService.remove(req.params.roleId);
            res.json({ message: 'success' });
        } catch (err) {
            logger.error(`Error deleting a role: ${err}`);
            next(err);
        }
    }
}
