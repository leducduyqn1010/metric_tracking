const Promise = require('bluebird');
const _ = require('lodash');
const uuid = require('node-uuid');

// Repositories
const DistanceTypeRepository = require('../repositories/distance_type.repository');

//Util
const Constants = require("../core/common/Constants");
const Formulas = require("../core/utils/business.formulas");
const Common = require("../core/utils/common");
const ERROR_CODES = require("../core/common/ErrorCode");
// Services
var BaseService = require('./base.service');
function DistanceTypeService() {
    BaseService.apply(this, arguments);
}

DistanceTypeService.prototype = Object.create(BaseService.prototype);

DistanceTypeService.prototype.constructor = DistanceTypeService;

DistanceTypeService.prototype.getAllByPredicate = async function (predicate) {
    try {
        let distances = await DistanceTypeRepository.findAllByProperty(predicate, { transacting: null });
        return Promise.resolve(distances)
    } catch (err) {
        if (err.message === 'EmptyResponse') {
            return Promise.reject(ERROR_CODES.DISTANCE_UNIT.DATA_NOT_EXIST);
        } else {
            return Promise.reject(err);
        }
    }
}

DistanceTypeService.prototype.getAll = async function () {
    try {
        let distances = await DistanceTypeRepository.findAll({ transacting: null });
        return Promise.resolve(distances)
    } catch (err) {
        if (err.message === 'EmptyResponse') {
            return Promise.reject(ERROR_CODES.DISTANCE_UNIT.DATA_NOT_EXIST);
        } else {
            return Promise.reject(err);
        }
    }
}

DistanceTypeService.prototype.getOneByPredicate = async function (predicate) {
    try {
        let distances = await DistanceTypeRepository.findByProperty(predicate, { transacting: null });
        return Promise.resolve(distances)
    } catch (err) {
        if (err.message === 'EmptyResponse') {
            return Promise.reject(ERROR_CODES.DISTANCE_UNIT.DATA_NOT_EXIST);
        } else {
            return Promise.reject(err);
        }
    }
}

module.exports = DistanceTypeService;