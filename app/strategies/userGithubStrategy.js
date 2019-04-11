const User = require('./../models/User');

const strategy = (accessToken, refreshToken, profile, done) => {
    User.findOne({githubId: profile.id}, (err, user) => {
        if (err) {
            return done(err);
        }
    
        if (!user) {
            const userData = {
                githubId: profile.id,
                email: profile.emails ? profile.emails[0].value : null,
                name: profile.displayName
            };
            User.create(userData, (err, githubUser) => {
                if (err) {
                    return done(err);
                }

                return done(null, githubUser);
            });
        }

        return done(null, user);
    })
};

module.exports = {
    settings: {
        clientID: 'f38df5d2cadcf420eb96',
        clientSecret: '3c0cba9aeb1954a0e057a5cd2c7daf204399457e',
        callbackURL: "http://127.0.0.1:3000/auth/github/callback"
    },
    strategy
};
