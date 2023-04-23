const Promise = require('bluebird');
const _ = require('lodash');
const uuid = require('node-uuid');

// Repositories
const TemperatureRepository = require('../repositories/temperature.repository');

// Service
const TemperatureTypeService = require('../services/temperature_type.service');
const UserService = require('../services/user.service');
//Util
const Constants = require("../core/common/Constants");
const Formulas = require("../core/utils/business.formulas");
const Common = require("../core/utils/common");
const ERROR_CODES = require("../core/common/ErrorCode");
// Services
const BaseService = require('./base.service');
function TemperatureService() {
    BaseService.apply(this, arguments);
    this.repository = TemperatureRepository;
    this.TemperatureTypeService = new TemperatureTypeService();
    this.UserService = new UserService();
}

TemperatureService.prototype = Object.create(BaseService.prototype);

TemperatureService.prototype.constructor = TemperatureService;

// Public methods
TemperatureService.prototype.create = async function (temperatureBody) {
    let self = this;
    try {
        let { userId, trackingDate, unit = '', value } = temperatureBody;
        if (!_.isNumber(value)) {
            return Promise.reject(ERROR_CODES.VALIDATE_VALUE.VALUE_INVALID);
        }
        await self.UserService.getById(userId);
        await self.TemperatureTypeService.getOneByPredicate({unit: unit});
        let temperatureTypes = await self.TemperatureTypeService.getAll();

        let mapped = temperatureTypes.map(item => ({ [item.unit]: item.id }) );
        let temperatureTypesObj = Object.assign({}, ...mapped );
        let data;
        switch (unit) {
            case Constants.TEMPERATURE_TYPE_C:
                data = fromCelsiusConvert(value, temperatureTypesObj);
                break;
            case Constants.TEMPERATURE_TYPE_F:
                data = fromFahrenheitConvert(value, temperatureTypesObj);
                break;
            case Constants.TEMPERATURE_TYPE_K:
                data = fromKevinConvert(value, temperatureTypesObj);
                break;
            default:
                data = fromCelsiusConvert(value, temperatureTypesObj);
                break;
        }

        let action = [];
        _.each(data, function (item) {
            item.userId = userId;
            item.trackingDate = trackingDate;
            action.push(self.repository.insert(item, {transacting: null}));
        });

        await Promise.all(action);
        return Promise.resolve({
            status: "success"
        })
    } catch (err) {
        return Promise.reject(err);
    }
}

TemperatureService.prototype.getAll = async function (body) {
    let self = this;
    try {
        let {userId = '' , unit = ''} = body;

        await self.UserService.getById(userId);

        let temperatureType = await self.TemperatureTypeService.getOneByPredicate({unit: unit});
        let temperatures = await self.repository.findAllByProperty({userId: userId, temperatureTypeId: temperatureType.id}, { transacting: null });
        return Promise.resolve({items: temperatures})
    } catch (err) {
        if (err.message === 'EmptyResponse') {
            return Promise.resolve({items: []});
        } else {
            return Promise.reject(err);
        }
    }
}

TemperatureService.prototype.getTemperatureReport = async function (body) {
    let self = this;
    try {
        let {userId = '' , unit = ''} = body;
        let dateRange = {
            min: body.fromDate,
            max: body.toDate
        };

        await self.UserService.getById(userId);
        await self.TemperatureTypeService.getOneByPredicate({unit: unit});

        let temperatures = await self.repository.getTemperatureReport(userId, unit, dateRange, { transacting: null });
        let listTimeUnitFromUtils = Common.getMonthsFromDateRange(dateRange.min, dateRange.max);
        return Promise.resolve({items: Common.mapDataReportOfMonth(listTimeUnitFromUtils, temperatures)})
    } catch (err) {
        return Promise.reject(err);
    }
}

function fromCelsiusConvert(value, temperatureTypes) {
    return [{
        temperatureTypeId: temperatureTypes[Constants.TEMPERATURE_TYPE_C],
        value: value
        },
        {
            temperatureTypeId: temperatureTypes[Constants.TEMPERATURE_TYPE_F],
            value: Formulas.CToF(value)
        },
        {
            temperatureTypeId: temperatureTypes[Constants.TEMPERATURE_TYPE_K],
            value: Formulas.CToK(value)
        },
    ];
}

function fromFahrenheitConvert(value, temperatureTypes) {
    let celsius = Formulas.FToC(value);
    return [{
        temperatureTypeId: temperatureTypes[Constants.TEMPERATURE_TYPE_C],
        value: celsius
        },
        {
            temperatureTypeId: temperatureTypes[Constants.TEMPERATURE_TYPE_F],
            value: value
        },
        {
            temperatureTypeId: temperatureTypes[Constants.TEMPERATURE_TYPE_K],
            value: Formulas.CToK(celsius)
        },
    ];
}

function fromKevinConvert(value, temperatureTypes) {
    let celsius = Formulas.KToC(value);
    return [{
        temperatureTypeId: temperatureTypes[Constants.TEMPERATURE_TYPE_C],
        value: celsius
        },
        {
            temperatureTypeId: temperatureTypes[Constants.TEMPERATURE_TYPE_F],
            value: Formulas.CToF(celsius)
        },
        {
            temperatureTypeId: temperatureTypes[Constants.TEMPERATURE_TYPE_K],
            value: value
        },
    ];
}

module.exports = TemperatureService;