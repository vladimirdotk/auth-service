const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const passport = require('passport');

router.get('/signin', (req, res) => {
    res.render('signin');
});

router.post(
    '/signin',
    passport.authenticate('local', { failureRedirect: '/auth/signin' }),
    (req, res) => {
        res.end(`Succsess! user.id: ${req.user.id}`)
    }
);

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {
    if (req.body.password === req.body.password2) {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        User.createUser(newUser, (err, user) => {
            if (err) {
                return res.status(500).send();
            }

            return res.end(`Succsess! user.id: ${user.id}`);
        });
    } else {
        return res.status(400)
            .send("{errors: \"Passwords don't match\"}")
            .end();
    }
});

router.get(
    '/github',
    passport.authenticate('github', { scope: ['user:email'] }),
);

router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/signup' }),
    (req, res) => res.send('Success!')
);

router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/signup' }),
    (req, res) => res.send('Success!')
);

router.get('/test', (req, res) => req.isAuthenticated() ? res.end('auth') : res.end('no auth'));


module.exports = router;