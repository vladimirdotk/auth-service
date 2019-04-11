const express = require('express');
const url = require('url');
const utils = require('./../utils');
const mailer = require('./../services/mailer');
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
        var user = await User.findById({ _id: req.params.userId });
    } catch (err) {
        console.log(`Error geting user with id ${req.params.userId}: ${err}`);
        return res.status(404).json({ message: "failed to get user" });
    }

    user.confirmCode = utils.getRandomName();

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
            { confirmCode: user.confirmCode }
        )
    });

    const mailOptions = {
        from: process.env.MAILER_EMAIL,
        to: user.email,
        subject: "Please confirm user data changes",
        text: `Please confirm user data changes: ${confirmUrl}`,
        html: `<div>Please confirm user data changes: ${confirmUrl}</div>`
    };

    if (process.env.NODE_ENV !== 'production') {
        try {
            await mailer.sendMail(mailOptions);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "failed to change user data" }); 
        }
        return res.json({ message: "email sent" });
    }
    
    res.json({ url: confirmUrl });
});

/* Confirm user data changes */
router.get('/:userId/confirm-changes', async (req, res) => {
    try {
        var user = await User.findById({ _id: req.params.userId });
    } catch(err) {
        console.log(`Error geting user with id ${req.params.userId}: ${err}`);
        return res.status(404).json({ message: "failed to get user" });
    }

    if (user.confirmCode !== req.query.confirmCode) {
        return res.status(400).json({ message: "Bad confirmation code" });   
    }

    for (const prop in Object.assign(req.query, { confirmCode: null })) {
        user[prop] = req.query[prop];
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