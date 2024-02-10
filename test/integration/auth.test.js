const request = require('supertest');
const { User } = require('../../models/User');
const { Genre } = require('../../models/Genre');
const mongoose = require('mongoose');

afterAll(async () => await mongoose.disconnect());

describe('auth middleware', () => {
    let token;

    beforeEach(() => { 
        server = require('../../index'); 
        token = new User().generateJwtToken();
    })
    afterEach(async () => { 
        await server.close();
        await Genre.deleteMany({});
    });


    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('X-Auth-Token', token)
            .send({ name: 'gener1'})
    }

    it('should return 401 if no token is proviced', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    })

    it('should return 400 if token is invalid', async () => {
        token = 'a';

        const res = await exec();

        expect(res.status).toBe(400);
    })

    it('should return 200 if token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    })
})