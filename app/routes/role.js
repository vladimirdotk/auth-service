const express = require('express');
const router = express.Router();
const Role = require('./../models/Role');

router.get('/', async (req, res) => {
    try {
        res.json(await Role.find());
    } catch (err) {
        console.log(`Error getting roles: ${err}`);
        res.status(500).json({ message: 'failed to get roles' })
    }
});

router.post('/', async (req, res) => {
    try {
        const role = await Role.create({ name: req.body.name });
        res.status(201).json(role)
    } catch (err) {
        console.log(`Error creating a role: ${err}`);
        res.status(400).json({ message: 'failed to create a role' });
    }
});

router.delete('/:roleId', async (req, res) => {
    try {
        const role = await Role.findByIdAndRemove({ _id: req.params.roleId });
        return role
            ? res.json({ message: 'success' })
            : res.status(404).json({ message: 'no role found' })
    } catch (err) {
        console.log(`Error deleting a role: ${err}`);
        res.status(500).json({ message: 'failed to delete role' });
    }
});

module.exports = router;