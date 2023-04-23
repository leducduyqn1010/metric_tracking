var RESOURCES = require('./BaseApiResource');

var ERROR_CODE = {
    USER: {
        USERNAME_EXISTED: {
            code: 1101,
            message: 'Username already existed, please try other username',
            field: 'username',
            resource: RESOURCES.USER_RESOURCE
        },
    },
};

module.exports = ERROR_CODE;