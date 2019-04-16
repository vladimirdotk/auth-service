const Role = require('./../models/Role');
const roleService = require('./../services/roleService');

const getRoles = async (req, res, next) => {
    try {
        res.json(await roleService.getAll());
    } catch (err) {
        console.log(`Error getting roles: ${err}`);
        next(err);
    }
}

const addRole = async (req, res, next) => {
    try {
        res.status(201).json(await Role.create({ name: req.body.name }))
    } catch (err) {
        console.log(`Error creating a role: ${err}`);
        next(err);
    }
}

const deleteRole = async (req, res, next) => {
    try {
        await roleService.remove(req.params.roleId);
        res.json({ message: 'success' });
    } catch (err) {
        console.log(`Error deleting a role: ${err}`);
        next(err);
    }
}

module.exports = {
    getRoles,
    addRole,
    deleteRole
}