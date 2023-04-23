const BaseRepository = require('./base.repository');
const knex = require('../datacontext/connection');
function DistanceRepository() {
    this.modelName = 'Distance';
    BaseRepository.apply(this, arguments);
}

DistanceRepository.prototype = Object.create(BaseRepository.prototype);

DistanceRepository.prototype.constructor = DistanceRepository;

DistanceRepository.prototype.getDistanceReport = function (userId, unit, dateRange, options) {
    options = this.getValue(options, {});
    let repo = this;
    let Model = repo.getModel();
    let promise = new Model().query(function (qb) {
        qb.select(knex.raw('YEAR( Distance.trackingDate) as year,' +
            'MONTH( Distance.trackingDate) as month, ' +
            'DAY( Distance.trackingDate) as day, ' +
            'Distance.trackingDate as trackingDate, ' +
            'Distance_Type.unit as unit, ' +
            'Distance.value as value'))
            .innerJoin('Distance_Type', 'Distance_Type.id', 'Distance.distanceTypeId')
            .groupBy(knex.raw('YEAR( Distance.trackingDate), MONTH( Distance.trackingDate), DAY( Distance.trackingDate)'))
            .orderByRaw('YEAR(Distance.trackingDate) ASC, MONTH(Distance.trackingDate) ASC, DAY( Distance.trackingDate) ASC');

            qb.where('Distance.userId', '=', userId);
            qb.whereRaw('DATEDIFF(Distance.trackingDate, ?) >= 0', [dateRange.min]);
            qb.whereRaw('DATEDIFF(?, Distance.trackingDate) >= 0', [dateRange.max]);
            qb.where('Distance_Type.unit', '=', unit);
            qb.andWhereRaw("Distance.createdAt IN (SELECT MAX( Distance.createdAt ) AS maxTime FROM Distance INNER JOIN Distance_Type on Distance_Type.id = Distance.distanceTypeId WHERE Distance.userId = '" + userId + "' AND Distance_Type.unit = ?  GROUP BY Distance.trackingDate)", [unit])
    }).fetchAll(options);

    return this.handleBookshelfPromise(promise);
};

module.exports = new DistanceRepository();
