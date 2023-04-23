const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const compression = require("compression");
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const timeout = require('connect-timeout');

const appDir = path.dirname(require.main.filename);
const config = require(appDir + '/config');
const ErrorHandlerConfiguration = require('./ErrorHandlerConfiguration');
const Routes = require('../routes');
function Configuration() {

}

Configuration.setup = function () {
    var app = express();
    console.log('(Process 3/' + config.appBootUpSteps + ') Configuring express...');
    Configuration.setupExpress(app);
    console.log('(Process 7/' + config.appBootUpSteps + ') Configuring routing...');
    Configuration.setupRouting(app);
    console.log('(Process 9/' + config.appBootUpSteps + ') Configuring error handler...');
    Configuration.setupErrorHandler(app);

    return app;
}

Configuration.setupExpress = function (app) {
    var maxAgeOptionRequest = 86400; // 24h cached for pre-flight request
    app.use(express.static('public'));
    app.use(timeout(config.server.timeout));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json({limit: config.importing.file.maxsize}));
    app.use(methodOverride());
    app.use(compression());
    app.use(cors({ maxAge: maxAgeOptionRequest }));
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        next();
    });
    // Prevent server return 304 status
    app.set('etag', false);
    // Hide server type (security purpose)
    app.set('x-powered-by', false);
    app.options('*', cors({ maxAge: maxAgeOptionRequest }));
    app.use(haltOnTimedout);
    function haltOnTimedout(req, res, next){
        if (!req.timedout) next();
    }
}

Configuration.setupRouting = function (app) {
    Routes.init(app);
}





Configuration.setupErrorHandler = function (app) {
    ErrorHandlerConfiguration.init(app);
}

module.exports = Configuration;