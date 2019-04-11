const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Role = require('./Role');

const Schema = mongoose.Schema;

const User = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    githubId: String,
    googleId: String,
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: Role }],
    confirmCode: String
}, { timestamps: true });

if (!User.options.toJSON) {
    User.options.toJSON = {};
}

User.options.toJSON.transform = (doc, ret) => {
    return {
        _id: ret._id,
        name: ret.name,
        email: ret.email,
        roles: ret.roles
    }
}

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