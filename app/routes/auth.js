const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const passport = require('passport');
const { validate } = require('./../middleware/validator');
const signupValidator = require('./../validators/signup');

router.post('/signup', validate(signupValidator), async (req, res, next) => {
    const { name, email, password } = req.body;
    
    try {
        const user = await User.createUser({ name, email, password });
        return res.end(`Succsess! user.id: ${user.id}`);
    } catch (err) {
        console.log(`Error signing up user: ${err}`)
        return res.status(500).send();
    }
});

router.get(
    '/signup',
    (req, res) => res.render('signup')
);

router.get(
    '/signin',
    (req, res) => res.render('signin')
);

router.post(
    '/signin',
    passport.authenticate('local', { failureRedirect: '/auth/signin' }),
    (req, res) => res.end(`Succsess! user.id: ${req.user.id}`)
);

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

router.get(
    '/test',
    (req, res) => req.isAuthenticated() ? res.end('auth') : res.end('no auth')
);

module.exports = router;