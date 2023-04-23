const BaseRepository = require('./base.repository');

function TemperatureTypeRepository() {
    this.modelName = 'TemperatureType';
    BaseRepository.apply(this, arguments);
}

TemperatureTypeRepository.prototype = Object.create(BaseRepository.prototype);

TemperatureTypeRepository.prototype.constructor = TemperatureTypeRepository;

module.exports = new TemperatureTypeRepository();
