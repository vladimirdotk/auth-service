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
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    strategy
};
