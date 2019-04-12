const utils = require('./../utils');
const Role = require('./../models/Role');
const User = require('./../models/User');

const createRole = async () => {
    return await Role.create({ name: utils.getRandomName() });
}

const deleteRole = async (roleId) => {
    await Role.findByIdAndRemove({ _id: roleId });
}

const createUser = async (userData = {}) => {
    return await User.createUser({
        email: userData.email || utils.getRandomName() + '@test.ru',
        name: userData.name || utils.getRandomName(),
        password: userData.password || utils.getRandomName(),
        roles: userData.roles || []
    });
};

const deleteUser = async (userId) => {
    await User.findByIdAndDelete({ _id: userId });
}

module.exports = {
    createRole,
    deleteRole,
    createUser,
    deleteUser
}