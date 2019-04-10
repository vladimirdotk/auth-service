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
        .catch((err) => {
            res.status = 400
            res.json(err)
        });
});

module.exports = router;
