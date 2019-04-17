const logger = require('./../components/logger');
const userSessionService = require('./../services/userSessionService');

const getAll = async (req, res, next) => {
    try {
        res.status(200).json(await userSessionService.getAll(req.params.userId));
    } catch (err) {
        logger.error(`Error getting sessions by user ${req.params.userId}`);
        next(err);
    }
}

const getOne = async (req, res, next) => {
    try {
        const session = await userSessionService.getOne(req.params.userId, req.params.sessionId);
        res.status(200).json(session);
    } catch (err) {
        logger.error(`Error getting session ${req.params.sessionId} by user ${req.params.userId}`);
        next(err);
    }
}

const removeOne = async (req, res, next) => {
    try {
        await userSessionService.removeAll(req.params.userId, req.params.sessionId);
        res.json({ "message" : "success" });
    } catch (err) {
        logger.error(`Error deleting session ${req.params.sessionId} by userId ${req.params.userId}`);
        next(err);
    }
}

const removeAll = async (req, res, next) => {
    try {
        await userSessionService.removeAll(req.params.userId);
        res.json({ "message" : "success" });
    } catch (err) {
        logger.error(`Error deleting sessions by userId ${req.params.userId}`);
        next(err);
    }
}

module.exports = {
    getOne,
    getAll,
    removeOne,
    removeAll
}