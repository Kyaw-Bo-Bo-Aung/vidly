const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({ 
    name: { 
        type: String, 
        require: true,
        minlength: 5,
        maxlength: 50 
    },
    email: { 
        type: String, 
        require: true,
        unique: true,
        minlength: 5,
        maxlength: 50 
    },
    password: { 
        type: String, 
        require: true,
        minlength: 5,
        maxlength: 1024 
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateJwtToken = function() {
    return jwt.sign({_id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET_KEY);
}

const User = mongoose.model('User', userSchema);

function validateInputFields(body) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(3).max(255).email().required(),
        password: Joi.string().min(3).max(1024).required(),
    });
    const { error } = schema.validate(body);
    return error;
}

exports.User = User;
exports.validate = validateInputFields;