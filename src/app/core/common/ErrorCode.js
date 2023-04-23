var RESOURCES = require('./BaseApiResource');

var ERROR_CODE = {
    USER: {
        USERNAME_EXISTED: {
            code: 1101,
            message: 'Username already existed, please try other username',
            field: 'username',
            resource: RESOURCES.USER_RESOURCE
        },
        USER_NOT_EXIST: {
            code: 1101,
            message: 'User not exist',
            field: 'id',
            resource: RESOURCES.USER_RESOURCE
        },
    },
    DISTANCE_UNIT: {
        DATA_NOT_EXIST: {
            code: 2101,
            message: 'Unit not exist',
            field: 'unit',
            resource: "Distance"
        },
    },
    TEMPERATURE_UNIT: {
        DATA_NOT_EXIST: {
            code: 2102,
            message: 'Unit not exist',
            field: 'unit',
            resource: "Temperature"
        },
    },
    VALIDATE_VALUE: {
        VALUE_INVALID: {
            code: 3102,
            message: 'Value invalid',
            field: 'value',
            resource: "metric_tracking"
        },
    },
};

module.exports = ERROR_CODE;