const BaseRepository = require('./base.repository');

function DistanceTypeRepository() {
    this.modelName = 'DistanceType';
    BaseRepository.apply(this, arguments);
}

DistanceTypeRepository.prototype = Object.create(BaseRepository.prototype);

DistanceTypeRepository.prototype.constructor = DistanceTypeRepository;

module.exports = new DistanceTypeRepository();
