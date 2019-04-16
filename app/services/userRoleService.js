const userService = require('./../services/userService');

const getAll = async (userId) => {
    const user = await userService.getById(userId);
    return { userId: user._id, roles: user.roles }
}

const add = async (userId, roleId) => {
    const user = await userService.getById(userId);
    const roleIds = user.roles.map(role => role.toString());
    roleIds.push(roleId);
    user.roles = [...new Set(roleIds)];
    await user.save();
    return { userId: user._id, roles: user.roles }
}

const remove = async (userId, roleId) => {
    const user = await userService.getById(userId);
    user.roles = user.roles
        .filter(role => role.toString() != roleId);
    await user.save();
    return { userId: user._id, roles: user.roles }
}

module.exports = {
    getAll,
    add,
    remove
}