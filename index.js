require('dotenv').config();
const express = require('express');
const winston = require('winston');
const app = express();

require('./startup/log')();
require('./startup/routes')(app);
require('./startup/db')();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    winston.info(`Server is running on port ${port}`);
});