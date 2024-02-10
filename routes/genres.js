const { Genre, validate } = require('../models/Genre');
const asyncWrapper = require('./../middleware/asyncWrapper');
const express = require('express');
const auth = require('./../middleware/auth');
const objectId = require('./../middleware/objectId');
const isAdmin = require('./../middleware/isAdmin');
const router = express.Router();

router.get('/', asyncWrapper(async (req, res) => {
    const results = await Genre.find();
    res.send(results);
}))

router.post('/', auth, asyncWrapper(async (req, res) => {
    const error = validate(req.body);
    if(error) return res.status(400).send(error);

    let genre = new Genre({ name: req.body.name })
    genre = await genre.save();
    return res.send(genre);
}))

router.put('/:id', auth, objectId, asyncWrapper(async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send('Genre was not found.');

    const error = validate(req.body);
    if(error) return res.status(400).send(error);

    genre.set({ name: req.body.name });
    const newGenre = await genre.save();
    res.send(newGenre);
}))

router.delete('/:id', auth, isAdmin, objectId, asyncWrapper(async (req, res) => {
    const deletedCount = await Genre.deleteOne({_id: req.params.id})
    res.send(deletedCount);
}))

router.get('/:id', objectId, asyncWrapper(async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send('Genre was not found.');

    res.send(genre);
}))

module.exports = router;