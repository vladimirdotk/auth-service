const User = require('./../models/User');

const strategy = async (accessToken, refreshToken, profile, done) => {
    let user;
    try {
        user = await User.findOne({ googleId: profile.id });
    } catch (err) {
        return done(err);
    }

    if (!user) {
        try {
            const googleUser = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.name.givenName
            });
            return done(null, googleUser);
        } catch(err) {
            return done(err);
        }
    }

    return done(null, user);
};

module.exports = {
    settings: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    strategy
};