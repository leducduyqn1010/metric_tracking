var Promise = require('bluebird');

var config = require('../../../config');
var knex = require('./connection');

function bootUp() {
  console.log("(Process 1/" + config.appBootUpSteps + ") Running migrations...");
  return knex.migrate.latest(config.database.migrations)
    .then(function() {
      console.log("(Process 2/" + config.appBootUpSteps + ") Initializing models...");

      // Trigger exports for all models on app load.
      // Then they will be catched in app life cycle.
      require('../models');

      return Promise.resolve();
    });
}

module.exports.bootUp = bootUp;