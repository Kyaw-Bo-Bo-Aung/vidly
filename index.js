require('dotenv').config();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/login');
const error = require('./middleware/error');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const winston = require('winston');
const app = express();
require('express-async-errors');

winston.exceptions.handle(
    new winston.transports.File({ filename: 'log/exceptions.log' }),
    new winston.transports.Console()
);

process.on('unhandledRejection', (ex) => {
    throw ex;
})

winston.add(new winston.transports.File({filename: 'log/logfile.log',}));

mongoose.connect(process.env.DB_URL)
.then(() => {
    winston.info('MongoDB is connected...');
})
.catch(err => winston.error("Error", err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api', auth);

app.use(error)

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Server is running on port ${port}`));