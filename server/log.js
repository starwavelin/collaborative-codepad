var winston = require('winston');
var logDir = './logs'; 

var logger = new (winston.Logger)({
    level: 'debug',
    transports: [
        new (winston.transports.Console)({ json: true, timestamp: true}),
        new winston.transports.File({ filename: logDir + '/debug.log', json: false})
    ],
    exceptionHandlers: [
        new (winston.transports.Console)({ json: false, timestamp: true}),
        new winston.transports.File({ filename: logDir + '/exceptions.log', json: false})
    ],
    exitOnError: false
});

module.exports = logger;