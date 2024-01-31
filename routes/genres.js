const Joi = require('joi');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('connected...'))
    .catch(err => console.log("Error", err));

const genreSchema = mongoose.Schema({ 
    name: { 
        type: String, 
        require: true,
        minlength: 5,
        maxlength: 50 
    } 
});
const Genre = mongoose.model('genre', genreSchema);

async function getAllGenres() {
    return await Genre.find();
}

async function getById(id) {
    return await Genre.findById(id);
}

async function createGenre(genre) {
    return await genre.save();
}

router.get('/', async (req, res) => {
    const results = await getAllGenres();
    res.send(results);
})

router.post('/', async (req, res) => {
    const error = validateGenreName(req.body);
    if(error) return res.status(400).send(error);

    try {
        const genre = new Genre({ name: req.body.name })
        const newGenre = await createGenre(genre);
        res.send(newGenre);
    } catch (error) {
        res.send(error)
    } 
})

router.put('/:id', async (req, res) => {
    try {
        const genre = await getById(req.params.id);
        if(!genre) return res.status(404).send('Genre was not found.');
    
        const error = validateGenreName(req.body);
        if(error) return res.status(400).send(error);

        genre.set({ name: req.body.name });
        const newGenre = await createGenre(genre);
        res.send(newGenre);
    } catch (error) {
        res.send(error)
    }
})

router.delete('/:id', async (req, res) => {
    try{  
        const deletedCount = await Genre.deleteOne({_id: req.params.id})
        res.send(deletedCount);
    } catch(error) {
        res.send(error);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const genre = await getById(req.params.id);
        if(!genre) return res.status(404).send('Genre was not found.');
        res.send(genre);
    } catch (error) {
        res.send(error)
    }
})

function validateGenreName(body) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    const { error } = schema.validate(body);
    return error;
}

module.exports = router;