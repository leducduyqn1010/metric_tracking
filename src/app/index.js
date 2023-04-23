var Promise = require('bluebird');
var path = require('path');

var appDir = path.dirname(require.main.filename);
var config = require(appDir + '/config');
let constant = require('./core/common/Constants');
var data = require('./datacontext');

var Configuration = require('./configurations/Configuration');


async function init(type) {
  console.log("Start application in `" + config.env + "` mode!");
  let app = null;
  switch (type) {
      case constant.API_SERVICE:
          await data.bootUp();
          app = Configuration.setup();
          break;
      // case constant.WORKER_IMPORT_SERVICE:
      //     app = ConfigurationImport.setup();
      //     break;
      // case constant.WORKER_GETPRICE_SERVICE:
      //     app = ConfigurationGetPrice.setup();
      //     SubscriptionWorker.startAll();
      //     //StockWorker.startAll();
      //     StockJobWorker.startAll();
      //     ForexHistoryWorker.startAll();
      //   //  CleanMailSystemWorker.startAll();
      //     break;
      // case constant.STRIPE_PAYMENT_SERVICE:
      //     app = ConfigurationStripePayment.setup();
      //     break;
      // case constant.INCOME_SERVICE:
      //     app = ConfigurationIncome.setup();
      //     break;
  }
  return Promise.resolve(app);

  //     // Init connection to DB and perform migration
  //     return data.bootUp()
  //         .then(function () {
  //             let app = Configuration.setup();
  //             return Promise.resolve(app);
  //         });

}

module.exports.init = init;
