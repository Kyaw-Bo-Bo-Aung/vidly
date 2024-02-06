const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function() {
    mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('MongoDB is connected...');
        winston.info('MongoDB is connected...');
    })
    .catch(err => winston.error("Error", err));
}