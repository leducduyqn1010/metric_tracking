const BaseRepository = require('./base.repository');
const knex = require('../datacontext/connection');
function TemperatureRepository() {
    this.modelName = 'Temperature';
    BaseRepository.apply(this, arguments);
}

TemperatureRepository.prototype = Object.create(BaseRepository.prototype);

TemperatureRepository.prototype.constructor = TemperatureRepository;

TemperatureRepository.prototype.getTemperatureReport = function (userId, unit, dateRange, options) {
    options = this.getValue(options, {});
    let repo = this;
    let Model = repo.getModel();
    let promise = new Model().query(function (qb) {
        qb.select(knex.raw('YEAR( Temperature.trackingDate) as year,' +
            'MONTH( Temperature.trackingDate) as month, ' +
            'DAY( Temperature.trackingDate) as day, ' +
            'Temperature.trackingDate as trackingDate, ' +
            'Temperature_Type.unit as unit, ' +
            'Temperature.value as value'))
            .innerJoin('Temperature_Type', 'Temperature_Type.id', 'Temperature.temperatureTypeId')
            .groupBy(knex.raw('YEAR( Temperature.trackingDate), MONTH( Temperature.trackingDate), DAY( Temperature.trackingDate)'))
            .orderByRaw('YEAR(Temperature.trackingDate) ASC, MONTH(Temperature.trackingDate) ASC, DAY( Temperature.trackingDate) ASC');

        qb.where('Temperature.userId', '=', userId);
        qb.whereRaw('DATEDIFF(Temperature.trackingDate, ?) >= 0', [dateRange.min]);
        qb.whereRaw('DATEDIFF(?, Temperature.trackingDate) >= 0', [dateRange.max]);
        qb.where('Temperature_Type.unit', '=', unit);
        qb.andWhereRaw("Temperature.createdAt IN (SELECT MAX( Temperature.createdAt ) AS maxTime FROM Temperature INNER JOIN Temperature_Type on Temperature_Type.id = Temperature.temperatureTypeId WHERE Temperature.userId = '" + userId + "' AND Temperature_Type.unit = ?  GROUP BY Temperature.trackingDate)", [unit])
    }).fetchAll(options);

    return this.handleBookshelfPromise(promise);
};

module.exports = new TemperatureRepository();
