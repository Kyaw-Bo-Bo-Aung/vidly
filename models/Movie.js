const Joi = require('joi');
const { genreSchema } = require('./Genre');
const mongoose = require('mongoose');

const Movie = mongoose.model('Movie', mongoose.Schema({
    title: {
        type: String, 
        require: true,
        minlength: 3,
        maxlength: 50
    },
    genre: [ genreSchema ],
    numberInStock: {
        type: Number,
        default: 0,
        validate: {
            validator: function (v) {
                return v >= 0;
            },
            message: function (props) {
                return `${props.path} must greater than 0, got '${props.value}'`;
            }
        }
    },
    dailyRentalRate: {
        type: Number,
        default: 0,
        validate: {
            validator: function (v) {
                return v >= 0;
            },
            message: function (props) {
                return `${props.path} must greater than 0, got '${props.value}'`;
            }
        }
    }
}));

function validateInputFields(reqBody) {
    const schema = Joi.object({
        title: Joi.string().required().min(3).max(50) ,
        genres: Joi.array(),
        numberInStock: Joi.number().min(0),
        dailyRentalRate: Joi.number().min(0)
    });
    const { error } = schema.validate(reqBody);
    return error;
}

exports.Movie = Movie;
exports.validate = validateInputFields;