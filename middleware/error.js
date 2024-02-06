const winston = require('winston');

module.exports = (err, req, res, next) => {
    winston.error("Runtime exception :", err);
    res.status(500).send('Service unavailable!')
}