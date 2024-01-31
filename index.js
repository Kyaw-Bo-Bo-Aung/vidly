const genres = require('./routes/genres');
const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/genres', genres);

app.get('/', (req, res) => {
    res.send('hello world');
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));