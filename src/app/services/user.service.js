const Promise = require('bluebird');
const _ = require('lodash');
const uuid = require('node-uuid');

// Repositories
const UserRepository = require('../repositories/user.repository');

// Services
const BaseService = require('./base.service');
function UserService() {
    BaseService.apply(this, arguments);
}

UserService.prototype = Object.create(BaseService.prototype);

UserService.prototype.constructor = UserService;

// Public methods
UserService.prototype.register = async function (username) {
    try {
        let registerUser = {
            username: username
        };
        let user = await UserRepository.insert(registerUser, { transacting: null });
        return Promise.resolve({
            id: user.id,
            username: user.username
        })
    } catch (err) {
        return Promise.reject(err);
    }
}

UserService.prototype.getAllUser = async function () {
    try {
        let users = await UserRepository.findAll({ transacting: null });
        return Promise.resolve({users: users})
    } catch (err) {
        return Promise.reject(err);
    }
}

module.exports = UserService;