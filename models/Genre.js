const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = mongoose.Schema({ 
    name: { 
        type: String, 
        require: true,
        minlength: 5,
        maxlength: 50 
    } 
});
const Genre = mongoose.model('Genre', genreSchema);

function validateGenreName(body) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    const { error } = schema.validate(body);
    return error;
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenreName;