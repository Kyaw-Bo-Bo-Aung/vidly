const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function() {
    const db = process.env.DB_URL;
    mongoose.connect(db)
    .then(() => {
        console.log(`MongoDB is connected to ${db}.`);
        winston.info(`MongoDB is connected to ${db}`);
    })
    .catch(err => {
        winston.error("Error", err);
        console.log("mongo db error", err);
    });
}