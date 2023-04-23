var Promise = require('bluebird');

var BaseController = require('./base.controller');
var DistanceService = require('../services/distance.service');

function DistanceController() {
    BaseController.apply(this, arguments);
    this.Service = new DistanceService();
    this.resource = "Distance";
}

DistanceController.prototype = Object.create(BaseController.prototype);

DistanceController.prototype.constructor = DistanceController;

DistanceController.prototype.create = function (req, res, next) {
    let self = this;
    var promise = self.Service.create(req.body);
    this.sendResponse(promise, req, res, next);
}

DistanceController.prototype.getAll = function (req, res, next) {
    let self = this;
    var promise = self.Service.getAll(req.body);
    this.sendResponse(promise, req, res, next);
}

DistanceController.prototype.getReport = function (req, res, next) {
    let self = this;
    var promise = self.Service.getDistanceReport(req.body);
    this.sendResponse(promise, req, res, next);
}


module.exports = new DistanceController();