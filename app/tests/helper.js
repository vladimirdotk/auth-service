const utils = require('./../utils');
const Role = require('./../models/Role');

const createRole = async () => {
    return await Role.create({ name: utils.getRandomName() });
}

const deleteRole = async (roleId) => {
    await Role.findByIdAndRemove({ _id: roleId });
}

module.exports = {
    createRole,
    deleteRole
}