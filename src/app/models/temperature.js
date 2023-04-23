const appBookshelf = require('./app_bookshelf');

const Temperature = appBookshelf.Model.extend({

// Instance methods and properties
tableName: 'Temperature',

},
{
    // Class (ie. static) functions and properties
});

module.exports = appBookshelf.model('Temperature', Temperature);