const auth = require('../middleware/auth');
const asyncWrapper = require('../middleware/asyncWrapper');
const express = require('express');
const moment = require('moment');
const { Rental } = require('../models/Rental');
const { Movie } = require('../models/Movie');
const route = express.Router();

route.post('/', auth, asyncWrapper(async (req, res) => {
    if(!req.body.customerId) return res.status(400).send('Customer ID is required');
    if(!req.body.movieId) return res.status(400).send('Movie ID is required');

    const rental = await Rental.findOne({ 'customer._id': req.body.customerId, 'movie._id': req.body.movieId });
    if(!rental) return res.status(404).send('Rental not found.');

    if(rental.dateReturn) return res.status(400).send('Rental is already return.');
    
    rental.dateReturn = Date.now();
    const rentalDays = moment().diff(rental.dateOut, 'days');
    rental.rentalFee =  rentalDays * rental.movie.dailyRentalRate;
    await rental.save();

    await Movie.updateOne({ _id: rental.movie._id },{ 
        $inc: { numberInStock: 1 } 
    });

    res.send(rental);
}))

module.exports = route;