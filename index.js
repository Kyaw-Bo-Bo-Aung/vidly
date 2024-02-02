const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const Fawn = require("fawn");
const app = express();

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('connected...'))
    .catch(err => console.log("Error", err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

Fawn.init('mongodb://localhost/vidly');

app.get('/', (req, res) => {
    res.send('hello world');
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));