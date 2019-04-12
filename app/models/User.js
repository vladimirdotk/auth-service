const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const util = require('util');

const Role = require('./Role');

const genSalt = util.promisify(bcrypt.genSalt);
const genHash = util.promisify(bcrypt.hash);
const compare = util.promisify(bcrypt.compare);

const Schema = mongoose.Schema;

const User = new Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        sparse: true
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

module.exports.createUser = async function(userData) {
    const salt = await genSalt(10);
    const hash = await genHash(userData.password, salt);
    userData.password = hash;
    
    return await this.create(userData);
};

module.exports.comparePassword = async (candidatePassword, hash) => {
    const isMatch = await compare(candidatePassword, hash);
    return Promise.resolve(isMatch);
};