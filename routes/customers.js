const express = require('express');
const router = express.Router();
const asyncWrapper = require('./../middleware/asyncWrapper');
const auth = require('./../middleware/auth');
const isAdmin = require('./../middleware/isAdmin');
const { Customer, validate } = require('./../models/Customer');

router.get('/', asyncWrapper(async (req, res) => {
    const results = await Customer.find();
    res.send(results);
}))

router.post('/', auth, asyncWrapper(async (req, res) => {
    const error = validate(req.body);
    if(error) return res.status(400).send(error);

    const customer = new Customer({ 
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold 
    });
    const newCustomer = await customer.save();
    res.send(newCustomer);
}))

router.put('/:id', auth, asyncWrapper(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send('Customer was not found.');

    const error = validate(req.body);
    if(error) return res.status(400).send(error);

    customer.set({ 
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold 
    });
    const newCustomer = await customer.save();
    res.send(newCustomer);
}))

router.delete('/:id', auth, isAdmin, asyncWrapper(async (req, res) => {
    const deletedCount = await Customer.deleteOne({_id: req.params.id})
    res.send(deletedCount);
}))

router.get('/:id', auth, asyncWrapper(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send('Customer was not found.');
    res.send(customer);
}))

module.exports = router;