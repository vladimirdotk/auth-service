const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Session = new Schema({
    expires: {
        type: Date,
        required: true
    },
    session: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Session', Session);