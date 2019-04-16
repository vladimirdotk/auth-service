const Role = require('./../models/Role');
const roleService = require('./../services/roleService');
const logger = require('./../components/logger');

const getRoles = async (req, res, next) => {
    try {
        res.json(await roleService.getAll());
    } catch (err) {
        logger.error(`Error getting roles: ${err}`);
        next(err);
    }
}

const addRole = async (req, res, next) => {
    try {
        res.status(201).json(await Role.create({ name: req.body.name }))
    } catch (err) {
        logger.error(`Error creating a role: ${err}`);
        next(err);
    }
}

const deleteRole = async (req, res, next) => {
    try {
        await roleService.remove(req.params.roleId);
        res.json({ message: 'success' });
    } catch (err) {
        logger.error(`Error deleting a role: ${err}`);
        next(err);
    }
}

module.exports = {
    getRoles,
    addRole,
    deleteRole
}