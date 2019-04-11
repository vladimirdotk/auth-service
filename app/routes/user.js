const express = require('express');
const url = require('url');
const utils = require('./../utils');
const mailer = require('./../services/mailer');
const User = require('./../models/User');

const router = express.Router();

/* Get users */
router.get('/', async (req, res) => {
    try {
        res.json(await User.find());
    } catch (err) {
        console.log(`Error geting users: ${err}`);
        return res.status(500).json({ message: "failed to get users" });
    }
});

/* Get user by id */
router.get('/:userId', async (req, res) => {
    try {
        res.json(await User.findOne({ _id: req.params.userId }));
    } catch (err) {
        console.log(`Error geting user with id ${req.params.userId}: ${err}`);
        return res.status(404).json({ message: "user not found" });
    }
});

/* Create user */
router.post('/', async (req, res) => {
    try {
        const user = await User.createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        console.log(`Error creating user: ${err}`);
        return res.status(500).json({ message: "failed to create user" });
    }
});

/* Delete user */
router.delete('/:userId', async (req, res) => {
    let user;

    try {
        user = await User.findById({ _id: req.params.userId });
    } catch (err) {
        console.log(`Error geting user with id ${req.params.userId}: ${err}`);
        return res.status(500).json({ message: "failed to get user" });
    }

    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }

    try {
        await user.remove();
    } catch (err) {
        console.log(`Error deleting user: ${err}`);
        return res.status(500).json({ message: "failed to delete user" });
    }

    return res.json({ message: "user deleted" });
});

/* Change user data */
router.patch('/:userId', async (req, res) => {
    let user;

    try {
        user = await User.findById({ _id: req.params.userId });
    } catch (err) {
        console.log(`Error geting user with id ${req.params.userId}: ${err}`);
        return res.status(500).json({ message: "failed to get user" });
    }

    if (!user) {
        return res.status(404).json({ message: "user not found" });
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
        query: Object.assign(req.body, { confirmCode: user.confirmCode })
    });

    const mailOptions = {
        from: process.env.MAILER_EMAIL,
        to: user.email,
        subject: "Please confirm user data changes",
        text: `Please confirm user data changes: ${confirmUrl}`,
        html: `<div>Please confirm user data changes: ${confirmUrl}</div>`
    };

    if (process.env.NODE_ENV === 'production') {
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
    let user;

    try {
        user = await User.findById({ _id: req.params.userId });
    } catch(err) {
        console.log(`Error geting user with id ${req.params.userId}: ${err}`);
        return res.status(500).json({ message: "failed to get user" });
    }

    if (!user) {
        return res.status(404).json({ message: "user not found" });
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