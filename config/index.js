var _ = require('lodash');

var env = process.env.NODE_ENV || 'development';
var config = _.assign({env: env}, require('./config.default'), require('./env/config.' + env.trim()));

module.exports = config;