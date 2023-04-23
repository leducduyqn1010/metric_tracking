const Promise = require('bluebird');
const _ = require('lodash');
const uuid = require('node-uuid');

// Repositories
const DistanceRepository = require('../repositories/distance.repository');
const DistanceTypeRepository = require('../repositories/distance_type.repository');

//Util
const Constants = require("../core/common/Constants");
const Formulas = require("../core/utils/business.formulas");
const Common = require("../core/utils/common");
// Services
var BaseService = require('./base.service');
function DistanceService() {
    BaseService.apply(this, arguments);
}

DistanceService.prototype = Object.create(BaseService.prototype);

DistanceService.prototype.constructor = DistanceService;

// Public methods
DistanceService.prototype.create = async function (distanceBody) {
    try {
        let { userId, trackingDate, unit = Constants.DISTANCE_TYPE_DEFAULT, value } = distanceBody;
        let distanceTypes = await DistanceTypeRepository.findAll({transacting: null});

        let mapped = distanceTypes.map(item => ({ [item.unit]: item.id }) );
        let distanceTypesObj = Object.assign({}, ...mapped );
        let data;
        switch (unit) {
            case Constants.DISTANCE_TYPE_CENTIMETER:
                data = fromCentimeterConvert(value, distanceTypesObj);
                break;
            case Constants.DISTANCE_TYPE_METER:
                data = fromMeterConvert(value, distanceTypesObj);
                break;
            case Constants.DISTANCE_TYPE_INCH:
                data = fromInchConvert(value, distanceTypesObj);
                break;
            case Constants.DISTANCE_TYPE_FEET:
                data = fromFeetConvert(value, distanceTypesObj);
                break;
            case Constants.DISTANCE_TYPE_YARD:
                data = fromYardConvert(value, distanceTypesObj);
                break;
            default:
                data = fromMeterConvert(value, distanceTypesObj);
                break;
        }

        let action = [];
        _.each(data, function (item) {
            item.userId = userId;
            item.trackingDate = trackingDate;
            action.push(DistanceRepository.insert(item, {transacting: null}));
        });

        await Promise.all(action);
        return Promise.resolve({
            status: "success"
        })

    } catch (err) {
        return Promise.reject(err);
    }
}

DistanceService.prototype.getAll = async function (body) {
    try {
        let {userId = '' , unit = Constants.DISTANCE_TYPE_DEFAULT} = body;
        let relations = ['distanceType'];
        let distanceType = await DistanceTypeRepository.findByProperty({unit: unit}, { transacting: null });
        let distances = await DistanceRepository.findAllByProperty({userId: userId, distanceTypeId: distanceType.id}, { transacting: null, withRelated: relations });
        return Promise.resolve({items: distances})
    } catch (err) {
        return Promise.reject(err);
    }
}

DistanceService.prototype.getDistanceReport = async function (body) {
    try {
        let {userId = '' , unit = Constants.DISTANCE_TYPE_DEFAULT} = body;
        let dateRange = {
            min: body.fromDate,
            max: body.toDate
        };

        let distances = await DistanceRepository.getDistanceReport(userId, unit, dateRange, { transacting: null });
        let listTimeUnitFromUtils = Common.getMonthsFromDateRange(dateRange.min, dateRange.max);
        return Promise.resolve({items: Common.mapDataReportOfMonth(listTimeUnitFromUtils, distances)})
    } catch (err) {
        return Promise.reject(err);
    }
}

function fromCentimeterConvert(value, distanceTypes) {
    let meter = Formulas.centimeterToMeter(value);
    return [{
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_CENTIMETER],
            value: value
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_METER],
            value: meter
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_INCH],
            value: Formulas.meterToInch(meter)
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_FEET],
            value: Formulas.meterToFeet(meter)
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_YARD],
            value: Formulas.meterToYard(meter)
        }
    ];
}

function fromMeterConvert(value, distanceTypes) {
    return [{
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_CENTIMETER],
            value: Formulas.meterToCentimeter(value)
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_METER],
            value: value
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_INCH],
            value: Formulas.meterToInch(value)
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_FEET],
            value: Formulas.meterToFeet(value)
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_YARD],
            value: Formulas.meterToYard(value)
        }
    ];
}

function fromInchConvert(value, distanceTypes) {
    let meter = Formulas.inchToMeter(value);
    return [{
        distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_CENTIMETER],
        value: Formulas.meterToCentimeter(meter)
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_METER],
            value: meter
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_INCH],
            value: value
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_FEET],
            value: Formulas.meterToFeet(meter)
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_YARD],
            value: Formulas.meterToYard(meter)
        }
    ];
}

function fromFeetConvert(value, distanceTypes) {
    let meter = Formulas.feetToMeter(value);
    return [{
        distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_CENTIMETER],
        value: Formulas.meterToCentimeter(meter)
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_METER],
            value: meter
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_INCH],
            value: Formulas.meterToInch(meter)
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_FEET],
            value: value
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_YARD],
            value: Formulas.meterToYard(meter)
        }
    ];
}

function fromYardConvert(value, distanceTypes) {
    let meter = Formulas.yardToMeter(value);
    return [{
        distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_CENTIMETER],
        value: Formulas.meterToCentimeter(meter)
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_METER],
            value: meter
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_INCH],
            value: Formulas.meterToInch(meter)
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_FEET],
            value: Formulas.meterToYard(meter)
        },
        {
            distanceTypeId: distanceTypes[Constants.DISTANCE_TYPE_YARD],
            value: value
        }
    ];
}

module.exports = DistanceService;