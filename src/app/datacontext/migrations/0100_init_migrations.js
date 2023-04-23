const uuid = require('node-uuid');
exports.up = async function (knex) {
    await initUserTable(knex);
    await initDistanceTypeTable(knex);
    await initDistanceTable(knex);
    await initTemperatureTypeTable(knex);
    await initTemperatureTable(knex);
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('User');
    await knex.schema.dropTableIfExists('Distance_Type');
    await knex.schema.dropTableIfExists('Distance');
    await knex.schema.dropTableIfExists('Temperature_Type');
    await knex.schema.dropTableIfExists('Temperature');
};

async function initUserTable(knex){
    return knex.schema.createTable('User', function (table) {
        table.uuid('id').primary();
        table.string('username').notNullable();
        table.dateTime('createdAt');
        table.dateTime('updatedAt');
    });
}

async function initDistanceTypeTable(knex){
    return knex.schema.createTable('Distance_Type', function (table) {
        table.uuid('id').primary();
        table.string('unit');
        table.dateTime('createdAt');
        table.dateTime('updatedAt');
    }).then(function () {
        let distanceTypes = [
            {
                id: uuid(),
                unit: "Meter",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuid(),
                unit: "Centimeter",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuid(),
                unit: "Inch",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuid(),
                unit: "Feet",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuid(),
                unit: "Yard",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        return  knex.insert(distanceTypes).into('Distance_Type');
    });
}

async function initDistanceTable(knex){
    return knex.schema.createTable('Distance', function (table) {
        table.uuid('id').primary();
        table.uuid('userId');
        table.foreign('userId').references('id').inTable('User');
        table.dateTime('trackingDate');
        table.uuid('distanceTypeId');
        table.foreign('distanceTypeId').references('id').inTable('Distance_Type');
        table.decimal('value', 22, 9);
        table.dateTime('createdAt');
        table.dateTime('updatedAt');
    });
}

async function initTemperatureTypeTable(knex){
    return knex.schema.createTable('Temperature_Type', function (table) {
        table.uuid('id').primary();
        table.string('unit');
        table.dateTime('createdAt');
        table.dateTime('updatedAt');
    }).then(function () {
        let distanceTypes = [
            {
                id: uuid(),
                unit: "C",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuid(),
                unit: "F",
                createdAt: new Date(),
                updatedAt: new Date()
            },      {
                id: uuid(),
                unit: "K",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        return  knex.insert(distanceTypes).into('Temperature_Type');
    });
}

async function initTemperatureTable(knex){
    return knex.schema.createTable('Temperature', function (table) {
        table.uuid('id').primary();
        table.uuid('userId');
        table.foreign('userId').references('id').inTable('User');
        table.dateTime('trackingDate');
        table.uuid('temperatureTypeId');
        table.foreign('temperatureTypeId').references('id').inTable('Temperature_Type');
        table.decimal('value', 22, 9);
        table.dateTime('createdAt');
        table.dateTime('updatedAt');
    });
}