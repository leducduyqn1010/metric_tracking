module.exports = {
    server: {
        port: 8181,
        timeout: '300s'
    },

    numberOfChildProcess: 1,
    appBootUpSteps: 3,
    appBootUpStepsImport: 3,
    appBootUpStepsIncome: 4,

    database: {
        client: "mysql",
        connection: {
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
        }
    },

    // Path of temporary directory under appRoot
    tempDirPath: "/tmp",
    langDirPath: "/lang",
    faqTemplateXml: '/en/faqTemplate.xml',
    faqTemplateCss: '/en/faqTemplate.css',

    logging: {
        file: {
            // Max size in bytes of the logfile,
            //  if the size is exceeded then a new file is created,
            //  a counter will become a suffix of the log file in decending order (largest = newest).
            maxsize: 5242880, // 5MB

            // Maxium log 10 files, remove older files if exceeded
            maxFiles: 10,

            // If true, log files will be rolled based on maxsize and maxfiles,
            //  but in ascending order (largest = oldest).
            tailable: true,

            // If true, all log files but the current one will be zipped.
            zippedArchive: true,
        },

        // Path of log directory under tempDir
        path: "/logs"
    },

    importing: {
        file: {
            maxsize: "50mb"
        }
    }
}