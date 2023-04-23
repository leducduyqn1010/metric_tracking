var Promise = require('bluebird');

var BaseController = require('./base.controller');
var TemperatureService = require('../services/temperature.service');

function TemperatureController() {
    BaseController.apply(this, arguments);
    this.Service = new TemperatureService();
    this.resource = "Temperature";
}

TemperatureController.prototype = Object.create(BaseController.prototype);

TemperatureController.prototype.constructor = TemperatureController;

TemperatureController.prototype.create = function (req, res, next) {
    let self = this;
    var promise = self.Service.create(req.body);
    this.sendResponse(promise, req, res, next);
}

TemperatureController.prototype.getAll = function (req, res, next) {
    let self = this;
    var promise = self.Service.getAll(req.body);
    this.sendResponse(promise, req, res, next);
}

TemperatureController.prototype.getReport = function (req, res, next) {
    let self = this;
    var promise = self.Service.getTemperatureReport(req.body);
    this.sendResponse(promise, req, res, next);
}


module.exports = new TemperatureController();