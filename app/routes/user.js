const express = require('express');
const url = require('url');
const utils = require('./../utils');
const User = require('./../models/User');

const router = express.Router();

/* Get roles */
router.get('/:userId/roles', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json({ userId: user._id, roles: user.roles })
    } catch (err) {
        res.status(400).json({ message: "failed to get user roles" })
    }
});

/* Add role */
router.post('/:userId/roles/:roleId', async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.userId });
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
});

/* Delete role */
router.delete('/:userId/roles/:roleId', async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.userId });
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
});

/* Change user data */
router.patch('/:userId', async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.userId });
    } catch (err) {
        console.log(`Error geting user with id ${req.params.userId}: ${err}`);
        return res.status(404).json({ message: "failed to get user" });
    }

    const confirmCode = utils.getRandomName();

    user.confirmCode = confirmCode;

    try {
        await user.save();
    } catch (err) {
        console.log(`Error saving user with id ${req.params.userId}: ${err}`);
        return res.status(500).json({ message: "failed to change user data" });
    }

    const confirmUrl = url.format({
        protocol: req.protocol,
        hostname: req.hostname,
        port: req.socket.localPort,
        pathname: `/users/${req.params.userId}/confirm-changes`,
        query: Object.assign(
            req.body,
            { code: utils.getRandomName() }
        )
    });

    /* TODO: send via email */
    res.json({ url: confirmUrl });
});

/* Confirm user data changes */
router.get('/:userId/confirm-changes', async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.userId });
        const code = user.confirmCode;
    } catch(err) {
        console.log(`Error geting user with id ${req.params.userId}: ${err}`);
        return res.status(404).json({ message: "failed to get user" });
    }

    if (user.confirmCode === req.query.confirmCode) {
        for (const prop in Object.assign(req.query, { confirmCode: null })) {
            user[prop] = req.query[prop];
        }
    }

    try {
        await user.save();
    } catch (err) {
        console.log(`Error saving user with id ${req.params.userId}: ${err}`);
        return res.status(500).json({ message: "failed to confrm user data changes" });
    }

    return res.json({ user });
});


module.exports = router;