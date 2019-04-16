const userRoleService = require('./../services/userRoleService');

const get = async (req, res, next) => {
    try {
        res.json(await userRoleService.getAll(req.params.userId));
    } catch (err) {
        console.log(`Error geting user ${req.params.userId} services: ${err}`);
        next(err);
    }
}

const add = async (req, res, next) => {
    try {
        res.json(await userRoleService.add(req.params.userId, req.params.roleId));
    } catch (err) {
        console.log(`Error adding role ${req.params.roleId} to user ${req.params.userId}: ${err}`);
        next(err);
    }
}

const remove = async (req, res, next) => {
    try {
        res.json(await userRoleService.remove(req.params.userId, req.params.roleId));
    } catch (err) {
        console.log(`Error deleting role ${req.params.roleId} from user ${req.params.userId}: ${err}`);
        next(err);
    }
}

module.exports = {
    get,
    add,
    remove
}