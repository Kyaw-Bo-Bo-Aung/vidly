const { User } = require('../models/User');
const Joi = require('joi');
const _ = require('lodash');
const asyncWrapper = require('./../middleware/asyncWrapper');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', asyncWrapper(async (req, res) => {
    const error = validate(req.body);
    if(error) return res.status(400).send(error);

    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send("Invalid email or password.");
    
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if(!isValid)  return res.status(400).send("Invalid email or password.");

    const token = user.generateJwtToken();
    res.send(token);
}))

function validate(body) {
    const schema = Joi.object({
        email: Joi.string().min(3).max(255).email().required(),
        password: Joi.string().min(3).max(1024).required(),
    });
    const { error } = schema.validate(body);
    return error;
}

module.exports = router;