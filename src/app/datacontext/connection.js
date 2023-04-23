var knex = require('knex');
var config = require('../../../config');

var knexInstance = knex(config.database);

module.exports = knexInstance;