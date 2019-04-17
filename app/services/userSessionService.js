const Session = require('./../models/Session');
const { NOT_FOUND } = require('http-status-codes');

const checkSession = (session) => {
    if (!session) {
        const error = new Error('Session not found');
        error.status = NOT_FOUND;
        throw error;
    }
}

const getAll = async (userId) => {
    return Session.find({ session: { $regex: new RegExp(userId) } });
}

const getOne = async (userId, sessionId) => {
    const session = await Session.findOne({
        _id: sessionId,
        session: { $regex: new RegExp(userId) } }
    );
    checkSession(session);
    return session;
}

module.exports = {
    getAll,
    getOne
}