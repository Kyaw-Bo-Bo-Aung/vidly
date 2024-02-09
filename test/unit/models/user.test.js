const { User } = require('../../../models/User'); 
const environment = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `./.env.${environment}`});
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('generateJwtToken', () => {
    it('should return valid jwt token', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(), 
            isAdmin: false
        };
        const user = new User(payload);
        const userToken = user.generateJwtToken();

        const userPayload = jwt.decode(userToken, process.env.JWT_SECRET_KEY);

        expect(userPayload).toMatchObject(payload);
    })
})