"use strict"
var RESOURCES = require('../common/BaseApiResource');
var HTTP_STATUS_CODE = require('../common/HttpStatusCode');
var _ = require('lodash');
function ResponseSerializer() {
}

ResponseSerializer.prototype.singleResourceResponse = function (data, resource) {
    return {
        data: data,
        meta: {
            type: resource
        }
    }
}

ResponseSerializer.prototype.collectionResourceResponse = function (data, resource) {
    var items = createListItems(data, resource);

    return {
        items: items,
        meta: {
            type: RESOURCES.COLLECTION,
            count: items.length
        }
    };
}

ResponseSerializer.prototype.collectionResourceRawResponse = function (data, resource) {
    return {
        items: data,
        meta: {
            type: RESOURCES.COLLECTION,
            count: data.length
        }
    };
}

function createListItems(data, resource) {
    var items = [];
    data.forEach(function (item) {
        items.push({
            data: item,
            meta: {
                type: resource
            }
        });
    });
    return items;
}

ResponseSerializer.prototype.createErrorResult = function (err, httpStatus) {
    httpStatus = httpStatus || HTTP_STATUS_CODE.BAD_REQUEST;

    if (err.name === "ValidationError") {
        return buildValidationErrorResponse(err, httpStatus);
    }
    else if (err.resource) {
        return buildResourceErrorResponse(err, httpStatus);
    }
    else if (_.isArray(err)) {
        return buildErrorResponseFromArray(err, httpStatus);
    }

    return buildSystemErrorResponse(err);
}

function getErrorItem(resource, field, code, message, details) {
    return {
        resource: resource,
        field: field,
        code: code,
        message: message,
        details: details,
        date: new Date()
    };
}

function getErrorItemMeta() {
    return {
        type: RESOURCES.ERROR
    };
}

function getErrorListMeta(status) {
    return {
        type: RESOURCES.COLLECTION,
        http_status: status
    }
}

function buildValidationErrorResponse(err, httpStatus) {
    var errors = [];
    Object.keys(err.errors).forEach(function (field) {
        errors.push({
            error: getErrorItem(err.resource, field, err.errorCode.code, err.errorCode.message, err.errors[field]),
            meta: getErrorItemMeta()
        });
    });

    return {
        errors: errors,
        meta: getErrorListMeta(httpStatus)
    };
}

function buildResourceErrorResponse(err, httpStatus) {
    return {
        errors: [{
            error: getErrorItem(err.resource, err.field, err.code, err.message, err.details),
            meta: getErrorItemMeta()
        }],
        meta: getErrorListMeta(httpStatus)
    };
}

function buildSystemErrorResponse(err) {

    let error = err.status  ? err.message : RESOURCES.INTERNAL_SERVER_ERROR;
    let status = err.status ? err.status : HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
    return {
        errors: [{
            error: getErrorItem(RESOURCES.SYSTEM, null, null, error, null),
            meta: getErrorItemMeta()
        }],
        meta: getErrorListMeta(status)
    };
}

function buildErrorResponseFromArray(err, httpStatus) {
    var errors = [];
    _.forEach(err, function(error) {
        errors.push({
            error: getErrorItem(error.resource, error.field, error.code, error.message, null),
            meta: getErrorItemMeta()
        })
    });

    return {
        errors: errors,
        meta: getErrorListMeta(httpStatus)
    }
}

module.exports = new ResponseSerializer();