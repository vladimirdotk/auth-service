const User = require('./../models/User');

const getUserRoles = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json({ userId: user._id, roles: user.roles })
    } catch (err) {
        res.status(500).json({ message: "failed to get user roles" })
    }
}

const addUserRole = async (req, res) => {
    let user;

    try {
        user = await User.findById({ _id: req.params.userId });
    } catch(err) {
        console.log(`Error geting user with id ${req.params.userId}: ${err}`);
        return res.status(404).json({ message: "failed to get user" });
    }

    const roleIds = user.roles.map(role => role.toString());
    roleIds.push(req.params.roleId);
    user.roles = [...new Set(roleIds)];
    
    try {
        await user.save();
    } catch (err) {
        console.log(`Error saving user with id ${req.params.id}: ${err}`)
        return res.status(500).json({ message: "failed to set user role" })
    }

    return res.json({ userId: user._id, roles: user.roles });
}

const deleteUserRole = async (req, res) => {
    let user;

    try {
        user = await User.findById({ _id: req.params.userId });
    } catch(err) {
        console.log(`Error geting user with id ${req.params.userId}: ${err}`);
        return res.status(404).json({ message: "failed to get user" });
    }

    user.roles = user.roles
        .filter(role => role.toString() != req.params.roleId);

    try {
        await user.save();
    } catch (err) {
        console.log(`Error saving user with id ${req.params.id}: ${err}`);
        return res.status(500).json({ message: "failed to delete user role" });
    }

    return res.json({ userId: user._id, roles: user.roles });
}

module.exports = {
    getUserRoles,
    addUserRole,
    deleteUserRole
}