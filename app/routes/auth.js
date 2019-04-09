const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const passport = require('passport');

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
                res.status(500).send();
            }
            res.send(user).end();
        });
    } else {
        res.status(500).send("{errors: \"Passwords don't match\"}").end();
    }
});

router.get(
    '/github',
    passport.authenticate('github',{ scope: [ 'user:email' ] }),
);

router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/signup' }),
    (req, res) => {
        res.redirect('/')
    }
);

router.get(
    '/google',
    passport.authenticate('google',{ scope: [ 'profile', 'email' ] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/signup' }),
    (req, res) => {
        res.redirect('/')
    }
);


module.exports = router;