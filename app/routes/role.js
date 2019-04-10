const express = require('express');
const router = express.Router();
const Role = require('./../models/Role');

router.get('/', function(req, res) {
    Role
        .find()
        .then((roles) => res.json(roles));
});

module.exports = router;
