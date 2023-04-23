const _ = require('lodash');

const BaseRepository = require('../repositories/base.repository');

function BaseService() {

}

BaseService.setDbTransaction = function (callback) {
    return BaseRepository.setDbTransaction(callback);
}

module.exports = BaseService;