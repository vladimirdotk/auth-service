const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL,
    format: winston.format.json(),
    defaultMeta: { service: 'auth-service' },
    transports: [
        new winston.transports.Console({
            format: winston.format.prettyPrint()
        })
    ]
});

module.exports = logger;