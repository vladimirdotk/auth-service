const User = require('./../models/User');
const userService = require('./../services/userService');

const getUsers = async (req, res, next) => {
    try {
        res.json(await userService.getAll());
    } catch (err) {
        console.log(`Error geting users: ${err}`);
        next(err);
    }
}

const getUserById = async (req, res, next) => {
    try {
        res.json(await userService.getById(req.params.userId));
    } catch (err) {
        console.log(`Error geting user with id ${req.params.userId}: ${err}`);
        next(err);
    }
}

const createUser = async (req, res, next) => {
    try {
        const user = await userService.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        console.log(`Error creating user: ${err}`);
        next(err);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        await userService.removeById(req.params.userId);
        res.json({ message: "user deleted" });
    } catch (err) {
        console.log(`Error deleting user with id ${req.params.userId}: ${err}`);
        next(err);
    }
}

const changeUser = async (req, res, next) => {
    try {
        const confirmUrl = await userService.changeUser({
            userId: req.params.userId,
            protocol: req.protocol,
            hostname: req.hostname,
            port: req.socket.localPort,
            userData: req.body
        });
        return process.env.NODE_ENV === 'production'
            ? res.json({ message: "email sent" })
            : res.json({ url: confirmUrl })
    } catch (err) {
        console.log(`Failed to change user data: ${err}`);
        next(err);
    }
}

const confirmChanges = async (req, res, next) => {
    try {
        const user = await userService.confirmChanges({
            userId: req.params.userId,
            userData: req.query
        });
        return res.json({ user });
    } catch(err) {
        console.log(`Error saving user with id ${req.params.userId}: ${err}`);
        next(err);
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    changeUser,
    confirmChanges
}