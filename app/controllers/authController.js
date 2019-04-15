const User = require('./../models/User');

const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        const user = await User.createUser({ name, email, password });
        res.end(`Succsess! user.id: ${user.id}`);
    } catch (err) {
        console.log(`Error signing up user: ${err}`)
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