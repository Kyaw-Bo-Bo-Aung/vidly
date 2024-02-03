const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/login');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const Fawn = require("fawn");
const app = express();
require('dotenv').config()

mongoose.connect(process.env.DB_URL)
    .then(() => console.log('connected...'))
    .catch(err => console.log("Error", err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api', auth);

Fawn.init(process.env.DB_URL);

app.get('/', (req, res) => {
    res.send('hello world');
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));