const User = require('./../models/User');

const strategy = (accessToken, refreshToken, profile, done) => {
    User.findOne({googleId: profile.id}, (err, user) => {
        if (err) {
            return done(err);
        }

        if (!user) {
            User.create({googleId: profile.id, email: profile.emails[0].value, name: profile.name.givenName}, (err, googleUser) => {
                if (err) {
                    return done(err);
                }

                return done(null, googleUser);
            });
        }

        return done(null, user);
    })
};

module.exports = {
    settings: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    strategy
};