const User = require('./../models/User');

const strategy = async (accessToken, refreshToken, profile, done) => {
    let user;
    try {
        user = await User.findOne({ githubId: profile.id });
    } catch (err) {
        return done(err);
    }

    if (!user) {
        try {
            const githubUser = await User.create({
                githubId: profile.id,
                name: profile.displayName
            });
            if (profile.emails) {
                githubUser.email = profile.emails[0].value
            } 
            return done(null, githubUser);
        } catch(err) {
            return done(err);
        }
    }

    return done(null, user);
};

module.exports = {
    settings: {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    strategy
};
