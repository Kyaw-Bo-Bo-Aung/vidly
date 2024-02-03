const { Genre, validate } = require('../models/Genre');
const express = require('express');
const auth = require('./../middleware/auth');
const isAdmin = require('./../middleware/isAdmin')
const router = express.Router();

router.get('/', async (req, res) => {
    const results = await Genre.find();
    res.send(results);
})

router.post('/', auth, async (req, res) => {
    const error = validate(req.body);
    if(error) return res.status(400).send(error);

    try {
        const genre = new Genre({ name: req.body.name })
        const newGenre = await genre.save();
        res.send(newGenre);
    } catch (error) {
        res.send(error)
    } 
})

router.put('/:id', auth, async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if(!genre) return res.status(404).send('Genre was not found.');
    
        const error = validate(req.body);
        if(error) return res.status(400).send(error);

        genre.set({ name: req.body.name });
        const newGenre = await genre.save();
        res.send(newGenre);
    } catch (error) {
        res.send(error)
    }
})

router.delete('/:id', auth, isAdmin, async (req, res) => {
    try{  
        const deletedCount = await Genre.deleteOne({_id: req.params.id})
        res.send(deletedCount);
    } catch(error) {
        res.send(error);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if(!genre) return res.status(404).send('Genre was not found.');
        res.send(genre);
    } catch (error) {
        res.send(error)
    }
})

module.exports = router;