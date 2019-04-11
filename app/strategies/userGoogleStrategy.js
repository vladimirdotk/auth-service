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
        clientID: '1052167067177-0nn55gtthlcjne9a5edv5d9sl19fmc49.apps.googleusercontent.com',
        clientSecret: 'CMuC1zqSk8rGT6XLsAeNH_IS',
        callbackURL: "http://127.0.0.1:3000/auth/google/callback"
    },
    strategy
};