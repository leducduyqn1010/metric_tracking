const _ = require('lodash');
const Promise = require("bluebird");
const uuid = require('node-uuid');

const appBookshelf = require('../models/app_bookshelf');

function BaseRepository() {

    var hasModelName = _.isString(this.modelName)
        && this.modelName.trim() !== '';
    if (!hasModelName) {
        throw new Error('modelName (string) of ' + this.constructor.name + ' is missing');
    }

    this.bookshelf = appBookshelf;
}

BaseRepository.prototype.getValue = function (input, defaultValue) {
    return typeof input !== 'undefined' ? input : defaultValue;
}

// Class (ie. static) functions
BaseRepository.setDbTransaction = function(callback) {
    return appBookshelf.transaction(callback);
}

// Instance functions
BaseRepository.prototype.getModel = function() {
    return require('../models/')[this.modelName];
}

BaseRepository.prototype.findAll = function(options) {
    var Model = this.getModel();

    var promise = new Model().orderBy('createdAt', 'DESC').fetchAll(options);

    return this.handleBookshelfPromise(promise);
}

BaseRepository.prototype.findById = function(id, options) {
    options = this.getValue(options, {});
    var Model = this.getModel();
    var model = new Model();

    options.require = _.isUndefined(options.require) ? true : options.require;

    var promise = model.where({ [model.idAttribute]: id}).fetch(options);

    return this.handleBookshelfPromise(promise);
}


BaseRepository.prototype.findByProperty = function(predicate, options) {
    options = this.getValue(options, {});
    var Model = this.getModel();
    var model = new Model();

    options.require = _.isUndefined(options.require) ? true : options.require;

    var promise = model.where(predicate).fetch(options);

    return this.handleBookshelfPromise(promise);
}

BaseRepository.prototype.findAllByProperty = function(predicate, options) {
    options = this.getValue(options, {});
    var Model = this.getModel();
    var model = new Model();

    options.require = _.isUndefined(options.require) ? true : options.require;

    var promise = model.where(predicate).fetchAll(options);

    return this.handleBookshelfPromise(promise);
}

BaseRepository.prototype.insert = function(data, options) {
    options = this.getValue(options, {});
    var Model = this.getModel();

    options.method = 'insert';

    if (!data.id) {
        data.id = uuid();
    }

    var promise = new Model(data).save(null, options);

    return this.handleBookshelfPromise(promise);
}

BaseRepository.prototype.batchInsert = function (array, options) {
    var transaction = options ? options.transacting : null;
    var knex = this.bookshelf.knex;
    array.forEach(item => {
        if (_.isUndefined(item.id)) {
            item.id = uuid();
        }
    });
    return knex.batchInsert(this.modelName, array, 1000).transacting(transaction);
}

BaseRepository.prototype.update = function(data, options) {
    options = this.getValue(options, {});
    data.updatedAt = new Date(new Date().getTime());
    var Model = this.getModel();

    options.method = 'update';
    var promise = new Model(data).save(null, options);

    return this.handleBookshelfPromise(promise);
}

BaseRepository.prototype.batchUpdate = function (array, options) {
    options = this.getValue(options, {});
    options.method = 'update';
    let Model = this.getModel();
    const queries = [];
    if(array.length <= 0)
    {
        return Promise.resolve();
    }
    _.each(array, function (item) {
        item.updatedAt = new Date(new Date().getTime());
        var query = new Model(item).save(null, options);
        queries.push(query);
    });
    return this.handleBookshelfPromise(Promise.all(queries));
}

BaseRepository.prototype.destroy = function(id, options) {
    options = this.getValue(options, {});
    var Model = this.getModel();
    var model = new Model();

    options.cascadeDelete = this.getValue(options.cascadeDelete, false);

    var promise = model.where({ [model.idAttribute]: id}).destroy(options);

    return this.handleBookshelfPromise(promise);
}

BaseRepository.prototype.updateByProperty = function (predicate, data, options) {
    options = this.getValue(options, {});
    var Model = this.getModel();
    var model = new Model();

    options.method = 'update';
    options.require = _.isUndefined(options.require) ? true : options.require;
    var promise = Model.where(predicate).save(data, options);

    return this.handleBookshelfPromise(promise);
}

// Use this function when the bookshelf promise resolve bookshelf.Model or bookshelf.Collection
//
// DONT NEED TO USE THIS, when:
// - Promise resolve normal Javascript datatypes (e.g. int, array, plain object)
// - Or call another repo function
BaseRepository.prototype.handleBookshelfPromise = function(promise) {
    return promise.then(function(rows) {
        var json = getJsonOrNull(rows);
        return Promise.resolve(json);
    });
}

function getJsonOrNull(data) {
    var json =_.attempt(function dataToJson(d) {
        return d.toJSON();
    }, data);

    if (_.isError(json)) {
        json = null;
    }

    return json;
}

module.exports = BaseRepository;