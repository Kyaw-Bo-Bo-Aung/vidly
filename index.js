const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const genres = [
    { id: 1, name: "Sci-fi" },
    { id: 2, name: "Drama" },
    { id: 3, name: "Comedy" }
];

app.get('/', (req, res) => {
    res.send('hello world');
})

app.get('/api/genres', (req, res) => {
    res.send(genres);
})

app.post('/api/genres', (req, res) => {
    const error = validateGenreName(req.body);
    if(error) return res.status(400).send(error);

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }
    genres.push(genre);
    res.send(genre);
})

app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));

    if(!genre) return res.status(404).send('Genre was not found.');

    const error = validateGenreName(req.body);
    if(error) return res.status(400).send(error);

    genre.name = req.body.name;
    res.send(genre);
})

app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));

    if(!genre) return res.status(404).send('Genre was not found.');

    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);
})

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));

    if(!genre) return res.status(404).send("Genre was not found!")

    res.send(genre);
})

function validateGenreName(body) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    const { error } = schema.validate(body);
    return error;
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));