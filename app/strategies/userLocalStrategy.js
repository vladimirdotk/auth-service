const User = require('./../models/User');

const strategy = function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
        if (err) {
            throw err;
        }
        if(!user){
            return done(null, false, {message: 'Unknown User'});
        }
        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            } else {
                return done(null, false, {message: 'Invalid password'});
            }
        });
    });
};

module.exports = {
    settings: {
        usernameField: 'email',
        passwordField: 'password'
    },
    strategy
};
