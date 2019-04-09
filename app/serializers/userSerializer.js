const User = require('./../models/User');

const serialize = (user, done) => done(null, user.id);

const deserialize = (id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
};

module.exports = {
    serialize,
    deserialize
};