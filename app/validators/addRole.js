const { body } = require('express-validator/check');
const Role = require('./../models/Role');

const validators = [
    body('name', 'Must be at least 3 and not more than 50 chars')
        .isLength({min: 3, max: 50}),
    body('name', 'Must be unique')
        .custom(async (value) => await Role.findOne({ name: value}) === null)
];

module.exports = validators;