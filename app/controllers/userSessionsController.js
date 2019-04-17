const logger = require('./../components/logger');
const userSessionService = require('./../services/userSessionService');

const getAll = async (req, res, next) => {
    try {
        res.status(200).json(await userSessionService.getAll(req.params.userId));
    } catch (err) {
        logger.error(`Error getting sessions by user ${req.param.userId}`);
        next(err);
    }
}

const getOne = async (req, res, next) => {}
const removeOne = async (req, res, next) => {}
const removeAll = async (req, res, next) => {}

module.exports = {
    getOne,
    getAll,
    removeOne,
    removeAll
}