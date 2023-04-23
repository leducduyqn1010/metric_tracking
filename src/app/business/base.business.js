var BaseService = require('../services/base.service');

function BaseBusiness() {

}

BaseBusiness.prototype.setDbTransaction = function (callback) {
    return BaseService.setDbTransaction(callback);
}

module.exports = BaseBusiness;