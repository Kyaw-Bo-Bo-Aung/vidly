const { Movie, validate } = require('../models/Movie');
const { Genre } = require('../models/Genre');
const auth = require('./../middleware/auth');
const asyncWrapper = require('./../middleware/asyncWrapper');
const isAdmin = require('./../middleware/isAdmin');
const express = require('express');
const router = express.Router();

router.get('/', asyncWrapper(async (req, res) => {
    const results = await Movie.find();
    res.send(results);
}))

router.post('/', auth, asyncWrapper(async (req, res) => {
    const error = validate(req.body);
    if(error) return res.status(400).send(error);

    const genres = await Genre.find({_id: { $in: [...req.body.genres]}}).select('_id name');

    const movie = new Movie({ 
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: genres
    });
    const newMovie = await movie.save();
    res.send(newMovie);     
}))

router.put('/:id', auth, asyncWrapper(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send('Movie was not found.');

    const error = validate(req.body);
    if(error) return res.status(400).send(error);

    const genres = await Genre.find({_id: { $in: [...req.body.genres]}}).select('_id name');

    movie.set({ 
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: genres 
    });
    const newMovie = await movie.save();
    res.send(newMovie);
}))

router.delete('/:id', auth, isAdmin, asyncWrapper(async (req, res) => {
    const deletedCount = await Movie.deleteOne({_id: req.params.id})
    res.send(deletedCount);
}))

router.get('/:id', asyncWrapper(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send('Genre was not found.');
    res.send(movie);
}))

module.exports = router;