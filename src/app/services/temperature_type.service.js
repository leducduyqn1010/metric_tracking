const Promise = require('bluebird');
const _ = require('lodash');
const uuid = require('node-uuid');

// Repositories
const TemperatureTypeRepository = require('../repositories/temperature_type.repository');

//Util
const Constants = require("../core/common/Constants");
const Formulas = require("../core/utils/business.formulas");
const Common = require("../core/utils/common");
const ERROR_CODES = require("../core/common/ErrorCode")
// Services
var BaseService = require('./base.service');
function TemperatureTypeService() {
    BaseService.apply(this, arguments);
}

TemperatureTypeService.prototype = Object.create(BaseService.prototype);

TemperatureTypeService.prototype.constructor = TemperatureTypeService;

TemperatureTypeService.prototype.getAllByPredicate = async function (predicate) {
    try {
        let distances = await TemperatureTypeRepository.findAllByProperty(predicate, { transacting: null });
        return Promise.resolve(distances)
    } catch (err) {
        if (err.message === 'EmptyResponse') {
            return Promise.reject(ERROR_CODES.TEMPERATURE_UNIT.DATA_NOT_EXIST);
        } else {
            return Promise.reject(err);
        }
    }
}

TemperatureTypeService.prototype.getAll = async function () {
    try {
        let distances = await TemperatureTypeRepository.findAll({ transacting: null });
        return Promise.resolve(distances)
    } catch (err) {
        if (err.message === 'EmptyResponse') {
            return Promise.reject(ERROR_CODES.TEMPERATURE_UNIT.DATA_NOT_EXIST);
        } else {
            return Promise.reject(err);
        }
    }
}

TemperatureTypeService.prototype.getOneByPredicate = async function (predicate) {
    try {
        let distances = await TemperatureTypeRepository.findByProperty(predicate, { transacting: null });
        return Promise.resolve(distances)
    } catch (err) {
        if (err.message === 'EmptyResponse') {
            return Promise.reject(ERROR_CODES.TEMPERATURE_UNIT.DATA_NOT_EXIST);
        } else {
            return Promise.reject(err);
        }
    }
}

module.exports = TemperatureTypeService;