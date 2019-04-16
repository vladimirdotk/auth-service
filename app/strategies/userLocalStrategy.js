const User = require('./../models/User');

const strategy = async (email, password, done) => {
    let user;
    try {
        user = await User.findOne({ email });
        if (!user) {
            return done(null, false, {message: 'Unknown User'});
        }
    } catch (err) {
        return done(err);
    }

    let match;
    
    try {
        match = await User.comparePassword(password, user.password);
        if (!match) {
            return done(null, false, {message: 'Invalid password'});
        }
    } catch (err) {
        return done(err);
    }

    return done(null, user);
};

module.exports = {
    settings: {
        usernameField: 'email',
        passwordField: 'password'
    },
    strategy
};
