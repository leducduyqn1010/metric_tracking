const Promise = require('bluebird');
const _ = require('lodash');
const uuid = require('node-uuid');

// Repositories
const UserRepository = require('../repositories/user.repository');

const ERROR_CODES = require("../core/common/ErrorCode");
// Services
const BaseService = require('./base.service');
function UserService() {
    BaseService.apply(this, arguments);
    this.repository = UserRepository;
}

UserService.prototype = Object.create(BaseService.prototype);

UserService.prototype.constructor = UserService;

// Public methods
UserService.prototype.register = async function (username) {
    let self = this;
    try {
        let foundUser = await self.getByUsername(username);
        if (foundUser) {
            return Promise.reject(ERROR_CODES.USER.USERNAME_EXISTED);
        }

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
    let self = this;
    try {
        let users = await UserRepository.findAll({ transacting: null });
        return Promise.resolve({items: users})
    } catch (err) {
        return Promise.reject(err);
    }
}

UserService.prototype.getByUsername = async function (username) {
    let self = this;
    try {
        let users = await self.repository.findByProperty({username: username}, { transacting: null });
        return Promise.resolve({users: users})
    } catch (err) {
        if (err.message === 'EmptyResponse') {
            return Promise.resolve(null);
        } else {
            return Promise.reject(err);
        }
    }
}

UserService.prototype.getById = async function (userId) {
    let self = this;
    try {
        let users = await self.repository.findByProperty({id: userId}, { transacting: null });
        return Promise.resolve({users: users})
    } catch (err) {
        if (err.message === 'EmptyResponse') {
            return Promise.reject(ERROR_CODES.USER.USER_NOT_EXIST);
        } else {
            return Promise.reject(err);
        }
    }
}

module.exports = UserService;