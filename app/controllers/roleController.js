const Role = require('./../models/Role');

const getRoles = async (req, res) => {
    try {
        res.json(await Role.find());
    } catch (err) {
        console.log(`Error getting roles: ${err}`);
        res.status(500).json({ message: 'failed to get roles' })
    }
}

const addRole = async (req, res) => {
    try {
        const role = await Role.create({ name: req.body.name });
        res.status(201).json(role)
    } catch (err) {
        console.log(`Error creating a role: ${err}`);
        res.status(400).json({ message: 'failed to create a role' });
    }
}

const deleteRole = async (req, res) => {
    try {
        await Role.findByIdAndRemove({ _id: req.params.roleId });
        res.json({ message: 'success' });
    } catch (err) {
        console.log(`Error deleting a role: ${err}`);
        res.status(500).json({ message: 'failed to delete role' });
    }
}

module.exports = {
    getRoles,
    addRole,
    deleteRole
}