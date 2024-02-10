const Joi = require('joi');
const mongoose = require('mongoose');

const rentalSchema = mongoose.Schema({ 
    customer: {
        type: new mongoose.Schema({
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
            }
        }),
        require: true

    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String, 
                require: true,
                minlength: 3,
                maxlength: 50
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
        }),
        require: true,
    },
    dateOut: {
        type: Date,
        require: true,
        default: Date.now
    },
    dateReturn: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateInputField(body) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });
    const { error } = schema.validate(body);
    return error;
}

exports.Rental = Rental;
exports.validate = validateInputField;