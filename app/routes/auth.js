const express = require('express');
const router = express.Router();
const User = require('../models/User.js');


router.get('/signin', (req, res) => {
    res.render('signin');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {
    const password = req.body.password;
    const password2 = req.body.password2;

    if (password === password2) {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        User.createUser(newUser, (err, user) => {
            if (err) {
                throw err;
            }
            res.send(user).end();
        });
    } else {
        res.status(500).send("{errors: \"Passwords don't match\"}").end();
    }
});


module.exports = router;