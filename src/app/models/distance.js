const appBookshelf = require('./app_bookshelf');

const Distance = appBookshelf.Model.extend({

    // Instance methods and properties
    tableName: 'Distance',
    distanceType: function() {
        return this.belongsTo('Distance_Type', 'distanceTypeId');
    },
},
{
    // Class (ie. static) functions and properties
    dependents: ['distanceType']
});

module.exports = appBookshelf.model('Distance', Distance);