const { User, validate } = require('../models/User');
const _ = require('lodash');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/', async (req, res) => {
    const error = validate(req.body);
    if(error) return res.status(400).send(error);

    try {
        let user = new User(_.pick(req.body, ['name', 'email', 'password']));
        const salt = await bcrypt.genSalt(10);
        user.password  = await bcrypt.hash(user.password, salt);
        await user.save();

        res.header('X-Auth-Token', user.generateJwtToken()).send(_.pick(user, ['_id', 'name', 'email']));
    } catch (error) {
        res.send(error)
    } 
})

module.exports = router;