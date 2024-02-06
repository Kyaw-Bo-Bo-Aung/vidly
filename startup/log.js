const winston = require('winston');

module.exports = function() {
    winston.exceptions.handle(
        new winston.transports.File({ filename: 'log/exceptions.log' }),
        new winston.transports.Console()
    );
    
    process.on('unhandledRejection', (ex) => { throw ex; })
    winston.add(new winston.transports.File({filename: 'log/logfile.log',}));
}