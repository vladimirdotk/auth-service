const User = require('./../models/User');
const logger = require('./../components/logger');

const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        const user = await User.createUser({ name, email, password });
        logger.debug(`Created user ${user.id}`)
        res.end(`Succsess! user.id: ${user.id}`);
    } catch (err) {
        logger.error(`Error signing up user ${name} ${email}: ${err}`)
        res.status(500).send();
    }
}
const showSignUpForm = (req, res) => res.render('signup');

const signIn = async (req, res) => res.end(`Succsess! user.id: ${req.user.id}`);
const showSignInForm = (req, res) => res.render('signin');

const success = (req, res) => res.send('Success!');

module.exports = {
    signUp,
    showSignUpForm,
    signIn,
    showSignInForm,
    success
}