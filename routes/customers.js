const express = require('express');
const router = express.Router();
const { Customer, validate } = require('./../models/Customer');

router.get('/', async (req, res) => {
    const results = await Customer.find();
    res.send(results);
})

router.post('/', async (req, res) => {
    const error = validate(req.body);
    if(error)
        return res.status(400).send(error);

    try {
        const customer = new Customer({ 
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold 
        })
        const newCustomer = await customer.save();
        res.send(newCustomer);
    } catch (error) {
        res.send(error)
    } 
})

router.put('/:id', async (req, res) => {
    try {
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
    } catch (error) {
        res.send(error)
    }
})

router.delete('/:id', async (req, res) => {
    try{  
        const deletedCount = await Customer.deleteOne({_id: req.params.id})
        res.send(deletedCount);
    } catch(error) {
        res.send(error);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if(!customer) return res.status(404).send('Customer was not found.');
        res.send(customer);
    } catch (error) {
        res.send(error)
    }
})

module.exports = router;