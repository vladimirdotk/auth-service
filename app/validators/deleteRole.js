const { param } = require('express-validator/check');
const Role = require('./../models/Role');

const validators = [
    param('roleId', 'Must exists')
        .custom(async (value) => await Role.findById({ _id: value}) !== null)
];

module.exports = validators;