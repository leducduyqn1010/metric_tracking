var Promise = require('bluebird');

var BaseController = require('./base.controller');
var UserService = require('../services/user.service');
var RESOURCES = require('./../core/common/BaseApiResource');

function UserController() {
    BaseController.apply(this, arguments);
    this.Service = new UserService();
    this.resource = RESOURCES.USER_RESOURCE;
}

UserController.prototype = Object.create(BaseController.prototype);

UserController.prototype.constructor = UserController;

UserController.prototype.register = function (req, res, next) {
    let self = this;
    let username = req.body.username;
    var promise = self.Service.register(username);
    this.sendResponse(promise, req, res, next);
}

UserController.prototype.allUser = function (req, res, next) {
    let self = this;
    var promise = self.Service.getAllUser();
    this.sendResponse(promise, req, res, next);
}


module.exports = new UserController();