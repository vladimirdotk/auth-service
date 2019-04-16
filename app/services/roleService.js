const Role = require('./../models/Role')

const getAll = async () => {
    return await Role.find();
}
 
const add = async (name) => {
    return await Role.create({ name });
}

const remove = async (roleId) => {
    return await Role.findByIdAndRemove({ _id: roleId });
}

module.exports = {
    getAll,
    add,
    remove
}