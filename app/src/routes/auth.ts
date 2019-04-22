import express = require('express');
import passport = require('passport');
import { validate } from './../middleware/validator';
import signupValidator from './../validators/signup';
import authController from './../controllers/authController';

const failureRedirect = '/auth/signin';
const githubOptions = { scope: ['user:email'] };
const googleOptions = { scope: ['profile', 'email'] };

const router = express.Router();

router.get('/signup', authController.showSignUpForm);
router.post('/signup', validate(signupValidator), authController.signUp);

router.get('/signin', authController.showSignInForm);
router.post('/signin', passport.authenticate('local', { failureRedirect }), authController.signIn);

router.get('/github', passport.authenticate('github', githubOptions));
router.get('/github/callback', passport.authenticate('github', { failureRedirect }), authController.success);

router.get('/google', passport.authenticate('google', googleOptions));
router.get('/google/callback', passport.authenticate('google', { failureRedirect }), authController.success);

router.get('/test', (req, res) => req.isAuthenticated() ? res.end('auth') : res.end('no auth'));

export default router;
