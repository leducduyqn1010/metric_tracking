let userRouter = require('./user.routes');
let distanceRouter = require('./distance.routes');
let temperatureRouter = require('./temperature.routes');
function init(app) {
    app.use(userRouter);
    app.use(distanceRouter);
    app.use(temperatureRouter);
}

module.exports.init = init;
