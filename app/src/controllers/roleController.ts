import logger from './../components/logger';
import { Request, Response, NextFunction } from 'express';
import { Role } from './../models/Role';
import roleService from './../services/roleService';

export default class RoleController {
    static async getRoles(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await roleService.getAll());
        } catch (err) {
            logger.error(`Error getting roles: ${err}`);
            next(err);
        }
    }

    static async addRole (req: Request, res: Response, next: NextFunction) {
        try {
            res.status(201).json(await Role.create({ name: req.body.name }));
        } catch (err) {
            logger.error(`Error creating a role: ${err}`);
            next(err);
        }
    }

    static async deleteRole (req: Request, res: Response, next: NextFunction) {
        try {
            await roleService.remove(req.params.roleId);
            res.json({ message: 'success' });
        } catch (err) {
            logger.error(`Error deleting a role: ${err}`);
            next(err);
        }
    }
}
