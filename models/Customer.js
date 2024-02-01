const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({ 
    name: { 
        type: String, 
        require: true,
        minlength: 5,
        maxlength: 50 
    },
    phone: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 15
    },
    isGold: {
        type: Boolean
    }
});

const Customer = mongoose.model('customer', customerSchema);

function validateInputFields(body) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(3).required(),
        isGold: Joi.boolean()
    });
    const { error } = schema.validate(body);
    return error;
}

exports.Customer = Customer;
exports.validate = validateInputFields;
