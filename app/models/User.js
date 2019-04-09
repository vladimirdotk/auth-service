const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const User = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    google: {
        id: String,
        name: String,
        email: String
    },
    github: {
        id: String,
        name: String,
        email: String
    }
}, { timestamps: true });

User.methods.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

User.methods.getUserById = (id, callback) => {
    User.findById(id, callback);
};

User.methods.getUserByEmail = (email, callback) => {
    User.findOne({email: email}, callback);
};

User.methods.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) {
            throw err;
        }
        callback(null, isMatch);
    });
};

module.exports = mongoose.model('User', User);
