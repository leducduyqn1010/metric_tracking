var appBookshelf = require('./app_bookshelf');

var User = appBookshelf.Model.extend({

  // Instance methods and properties
  tableName: 'User',

},
{
  // Class (ie. static) functions and properties
});

module.exports = appBookshelf.model('User', User);