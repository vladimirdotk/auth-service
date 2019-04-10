const express = require('express');
const router = express.Router();
const Role = require('./../models/Role');

router.get('/', (req, res) => {
    Role
        .find()
        .then((roles) => res.json(roles));
});

router.post('/', (req, res) => {
    const role = new Role({ name: req.body.name })
    role
        .save()
        .then((role) => res.json(role))
        .catch((err) => res.status(400).json(err));
});

router.delete('/', (req, res) => {
    Role.findByIdAndRemove({ _id: req.body.id }, (err, role) => {
        if (err) {
            return res.status(500).json({ message: 'fail to delete role' });
        }

        if (role) {
            return res.json({ message: 'success' })
        }

        res.status(404).json({ message: 'no role found' })
    });
});

module.exports = router;