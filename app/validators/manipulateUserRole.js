const { param } = require('express-validator/check');
const User = require('./../models/User');
const Role = require('./../models/Role');

const validators = [
    param('userId', 'User must exists')
        .custom(async (value) => await User.findById({ _id: value}) !== null),
    param('roleId', 'Role must exists')
        .custom(async (value) => await Role.findById({ _id: value}) !== null)
];

module.exports = validators;