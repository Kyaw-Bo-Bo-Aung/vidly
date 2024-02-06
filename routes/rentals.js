const { Movie } = require('../models/Movie');
const { Customer } = require('../models/Customer');
const { Rental, validate } = require('../models/Rental');
const asyncWrapper = require('./../middleware/asyncWrapper');
const auth = require('./../middleware/auth');
const isAdmin = require('./../middleware/isAdmin')
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/', auth, isAdmin, asyncWrapper(async (req, res) => {
    const results = await Rental.find();
    res.send(results);
}))

router.post('/', auth, isAdmin, asyncWrapper(async (req, res) => {
    const error = validate(req.body);
    if(error) return res.status(400).send(error);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send("Invalid customer.");

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send("Invalid movie.");
    if(movie.numberInStock === 0) return res.status(400).send("Movie is out of stock.");

    const session = await mongoose.startSession();
    session.startTransaction();
    let rental = new Rental({ 
        customer: {
            _id : customer._id,
            name: customer.name,
            phone: customer.phone
        },
        moive: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    await rental.save();
    
    movie.numberInStock--;
    movie.save();

    /* for mongodb transaction (need mongod replica set setting) */
    // rental = await Rental.create( [{ 
    //     customer: {
    //         _id : customer._id,
    //         name: customer.name,
    //         phone: customer.phone
    //     },
    //     moive: {
    //         _id: movie._id,
    //         title: movie.title,
    //         dailyRentalRate: movie.dailyRentalRate
    //     }
    // }], { session });
    // await Movie.findByIdAndUpdate(
    //     movie._id,
    //     { $inc: { numberInStock: -1 } },
    //     { session }
    // );

    // await session.commitTransaction();
    res.send(rental);
    session.endSession();
}))

// router.put('/:id', async (req, res) => {
//     // const error = validate(req.body);
//     // if(error) return res.status(400).send(error);
//     try {
//         const oldRental = await Rental.findById(req.params.id);

//         if(!oldMovie) return res.status(400).send("Invalid movie.");
//         if(movie.numberInStock === 0) return res.status(400).send("Movie is out of stock.");


//         const customer = await Customer.findById(req.body.customerId);
//         if(!customer) return res.status(400).send("Invalid customer.");

//         const movie = await Movie.findById(req.body.movieId);
//         if(!movie) return res.status(400).send("Invalid movie.");
//         if(movie.numberInStock === 0) return res.status(400).send("Movie is out of stock.");

//         const rental = new Rental({ 
//             customer: {
//                 _id : customer._id,
//                 name: customer.name,
//                 phone: customer.phone
//             },
//             moive: {
//                 _id: movie._id,
//                 title: movie.title,
//                 dailyRentalRate: movie.dailyRentalRate
//             }
//         });

//         const newRental = await rental.save();

//         movie.numberInStock--;
//         movie.save();

//         res.send(newRental);
//     } catch (error) {
//         res.send(error)
//     }
// })

// router.delete('/:id', async (req, res) => {
//     try{  
//         const deletedCount = await Movie.deleteOne({_id: req.params.id})
//         res.send(deletedCount);
//     } catch(error) {
//         res.send(error);
//     }
// })

router.get('/:id', auth, isAdmin, asyncWrapper(async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if(!rental) return res.status(404).send('Rental was not found.');
    
    res.send(rental);
}))

module.exports = router;