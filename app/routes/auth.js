const express = require('express');
const router = express.Router();
const passport = require('passport');
const { validate } = require('./../middleware/validator');
const signupValidator = require('./../validators/signup');
const authController = require('./../controllers/authController');

const failureRedirect = '/auth/signin';
const githubOptions = { scope: ['user:email'] };
const googleOptions = { scope: ['profile', 'email'] };

router.get('/signup', authController.showSignUpForm);
router.post('/signup', validate(signupValidator), authController.signUp);

router.get('/signin', authController.showSignInForm);
router.post('/signin', passport.authenticate('local', { failureRedirect }), authController.signIn);

router.get('/github', passport.authenticate('github', githubOptions));
router.get('/github/callback', passport.authenticate('github', { failureRedirect }), authController.success);

router.get('/google', passport.authenticate('google', googleOptions));
router.get('/google/callback', passport.authenticate('google', { failureRedirect }), authController.success);

router.get('/test', (req, res) => req.isAuthenticated() ? res.end('auth') : res.end('no auth'));

module.exports = router;