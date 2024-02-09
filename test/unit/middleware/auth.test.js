const environment = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `./.env.${environment}`});
const mongoose = require('mongoose');
const auth = require("../../../middleware/auth");
const { User } = require("../../../models/User")

describe('auth middleware', () => {
    it('should populate req.use with the payload of a valid JWT', () => {
        const user = {
            _id: new mongoose.Types.ObjectId().toHexString(), 
            isAdmin: true
        };

        const token  = new User(user).generateJwtToken();
        const req = {
            get: jest.fn().mockReturnValue(token)
        };
        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(req.authUser).toMatchObject(user);
    })
})