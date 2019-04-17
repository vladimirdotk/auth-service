const Session = require('./../models/Session');

const getAll = async (userId) => {
    return Session.find({ session: { $regex: new RegExp(userId) } });
}

module.exports = {
    getAll
}