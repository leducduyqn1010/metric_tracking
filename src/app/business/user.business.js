const Promise = require('bluebird');
const _ = require('lodash');
const BaseBusiness = require('./base.business');
// Services
const UserService = require('../services/user.service');

function UserBusiness() {
    BaseBusiness.apply(this, arguments);
    this.UserService = new UserService();
}

UserBusiness.prototype = Object.create(BaseBusiness.prototype);

UserBusiness.prototype.constructor = UserBusiness;

UserBusiness.prototype.register = async function (username) {
    try {
      let registerUser = {
          username: username
      };
      let user = await this.UserService.createUser(registerUser);
      return Promise.resolve({
          id: user.id,
          username: user.username
      })
    } catch (err) {
       return Promise.reject(err);
    }
};

UserBusiness.prototype.getAllUser = async function () {
    try {
        let users = await this.UserService.getAllUser();
        return Promise.resolve({users: users})
    } catch (err) {
        return Promise.reject(err);
    }
};

module.exports = UserBusiness;