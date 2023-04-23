var _ = require('lodash');
var Promise = require('bluebird');
var moment = require('moment');

var ErrorCode = require('../core/common/ErrorCode');
var ResponseSerializer = require('./../core/utils/responseSerializer');

var BaseBusiness = require('../business/base.business');

function BaseController() {
    this.Business = new BaseBusiness();
    this.resource = null;
}

BaseController.prototype.setDbTransaction = function (callback) {
    return this.Business.setDbTransaction(callback);
}
BaseController.prototype.sendResponseWithResult = function (result, req, res, next) {
    var promisse = new Promise(function(resolve, reject) { 
        res.set('Cache-Control', 'no-cache,no-store');
        res.json(result);
        resolve();
     } );
}
BaseController.prototype.sendResponse = function (promise, req, res, next) {
    return formatResponse(promise, this.resource)
        .then(function (result) {
            res.set('Cache-Control', 'no-cache,no-store');
            res.json(result);

        })
        .catch(function (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                console.log(error);
                next(ErrorCode.SYSTEM_SETTINGS.SYSTEM_SETTINGS_VALIDATION_FAILED);
            }
            else
            {
                next(error);
            }
        });
}

BaseController.prototype.sendRawResponse = function (promise, req, res, next) {
    return formatRawResponse(promise, this.resource)
        .then(function (result) {
            res.set('Cache-Control', 'no-cache,no-store');
            res.json(result);
        })
        .catch(function (error) {
            next(error);
        });
}

function formatResponse(responsePromise, resource) {
    var formattedResponse = {};

    return responsePromise.then(function (results) {
        if (_.isArray(results)) {
            formattedResponse = ResponseSerializer.collectionResourceResponse(results, resource);
        }
        else {
            formattedResponse = ResponseSerializer.singleResourceResponse(results, resource);
        }

        return Promise.resolve(formattedResponse);
    });
}

function formatRawResponse(responsePromise, resource) {
    var formattedResponse = {};

    return responsePromise.then(function (results) {
        if (_.isArray(results)) {
            formattedResponse = ResponseSerializer.collectionResourceRawResponse(results, resource);
        }
        else {
            formattedResponse = ResponseSerializer.singleResourceResponse(results, resource);
        }

        return Promise.resolve(formattedResponse);
    });
}

module.exports = BaseController;