var bookshelf = require('bookshelf');
var uuid = require('node-uuid');
var cascadeDelete = require('bookshelf-cascade-delete');

var knex = require('../datacontext/connection');

// Initializes a new Bookshelf instance called appBookshelf, for reference elsewhere in Ghost.
var appBookshelf = bookshelf(knex);

// Load the Bookshelf registry plugin, which helps us avoid circular dependencies
appBookshelf.plugin('registry');

appBookshelf.plugin(cascadeDelete);

// ## appBookshelf.Model
// The BaseModel which other models will inherit from
appBookshelf.Model = appBookshelf.Model.extend({

  // Instance methods and properties

  // Bookshelf `hasTimestamps` - auto populate createdAt and updatedAt
  hasTimestamps: ['createdAt', 'updatedAt'],

  // Bookshelf `defaults` - default values when creating a model instance
  // override this setting if the model need more/less default properties

  // defaults: function defaults() {
  //   return {
  //       id: uuid.v4()
  //   };
  // }
},
{
  // Class (ie. static) functions and properties
});

module.exports = appBookshelf;