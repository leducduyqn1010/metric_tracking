const appBookshelf = require('./app_bookshelf');

const TemperatureType = appBookshelf.Model.extend({

// Instance methods and properties
        tableName: 'Temperature_Type',

    },
    {
        // Class (ie. static) functions and properties
    });

module.exports = appBookshelf.model('Temperature_Type', TemperatureType);