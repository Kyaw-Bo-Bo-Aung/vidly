const { Movie, validate } = require('../models/Movie');
const { Genre } = require('../models/Genre');
const auth = require('./../middleware/auth');
const isAdmin = require('./../middleware/isAdmin');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const results = await Movie.find();
    res.send(results);
})

router.post('/', auth, async (req, res) => {
    const error = validate(req.body);
    if(error) return res.status(400).send(error);

    const genres = await Genre
                    .find({_id: { $in: [...req.body.genres]}})
                    .select('_id name');

    try {
        const movie = new Movie({ 
            title: req.body.title,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
            genre: genres
        });
        const newMovie = await movie.save();
        res.send(newMovie);
    } catch (error) {
        res.send(error)
    } 
})

router.put('/:id', auth, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if(!movie) return res.status(404).send('Movie was not found.');
    
        const error = validate(req.body);
        if(error) return res.status(400).send(error);

        const genres = await Genre
                        .find({_id: { $in: [...req.body.genres]}})
                        .select('_id name');

        movie.set({ 
            title: req.body.title,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
            genre: genres 
        });
        const newMovie = await movie.save();
        res.send(newMovie);
    } catch (error) {
        res.send(error)
    }
})

router.delete('/:id', auth, isAdmin, async (req, res) => {
    try{  
        const deletedCount = await Movie.deleteOne({_id: req.params.id})
        res.send(deletedCount);
    } catch(error) {
        res.send(error);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if(!movie) return res.status(404).send('Genre was not found.');
        res.send(movie);
    } catch (error) {
        res.send(error)
    }
})

module.exports = router;