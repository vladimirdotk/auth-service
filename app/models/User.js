const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const User = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    githubId: String,
    googleId: String
}, { timestamps: true });

module.exports = mongoose.model('User', User);

module.exports.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) {
            throw err;
        }
        callback(null, isMatch);
    });
};