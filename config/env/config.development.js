module.exports = {
    database: {
        client: "mysql",
        connection: {
            // host: "192.168.80.50",
            host: "localhost",
            port: 3306,
            database: "metric_tracking",
            user: "root",
            password: "12345678x@X",
            charset: "utf8",
            timezone: "UTC"
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './src/app/datacontext/migrations'
        },
        pool: {
            min: 2,
            max: 30,
            createTimeoutMillis: 3000,
            acquireTimeoutMillis: 30000,
            idleTimeoutMillis: 30000,
            reapIntervalMillis: 1000,
            createRetryIntervalMillis: 100,
            propagateCreateError: false // <- default is true, set to false
        }
    },
}