const express = require('express');
const router = express.Router();
const User = require('./../models/User');

router.get('/:userId/roles', (req, res) => {
    User.findById(req.params.userId)
        .then((user) => res.json({ userId: user._id, roles: user.roles }))
        .catch(() => res.status(400).json({ message: "failed to get user roles" }))
});

router.post('/:userId/roles/:roleId', (req, res) => {
    User.findById({ _id: req.params.userId })
        .then(user => user)
        .catch(err => {
            console.log(`Error geting user with id ${req.params.userId}: ${err}`);
            return res.status(404).json({ message: "failed to get user" });
        })
        .then(user => {
            const { roles } = user;
            const roleIds = roles.map(role => role.toString());
            roleIds.push(req.params.roleId);
            user.roles = [...new Set(roleIds)];
            return user.save()
        })
        .then(user => {
            return res.json({ userId: user._id, roles: user.roles })
        })
        .catch(err => {
            console.log(`Error saving user with id ${req.params.id}: ${err}`)
            return res.status(500).json({ message: "failed to set user role" })
        })
})

module.exports = router;