const appBookshelf = require('./app_bookshelf');

const DistanceType = appBookshelf.Model.extend({

// Instance methods and properties
        tableName: 'Distance_Type',

    },
    {
        // Class (ie. static) functions and properties
    });

module.exports = appBookshelf.model('Distance_Type', DistanceType);