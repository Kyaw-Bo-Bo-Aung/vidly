const request = require('supertest');
const { Genre } = require('../../models/Genre');
const { User } = require('../../models/User');
const mongoose = require('mongoose');

let server;

afterAll(async () => await mongoose.disconnect());

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index'); })
    afterEach(async () => { 
        await server.close();
        await Genre.deleteMany({});
    });

    describe('GET /', () => {
        it('should return all genres',async () => {
            await Genre.insertMany([
                { name: 'genre1'},
                { name: 'genre2'}
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /{id}', () => {
        it('should return a genre when id is given', async () => {
            const genre = new Genre({ name: 'genre1'});
            await genre.save();

            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        })

        it('should return 400 not found when id is invalid', async () => {
            const res = await request(server).get(`/api/genres/1`);
            expect(res.status).toBe(400);
        });

        it('should return 404 not found when there is no genre with given object id', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(server).get(`/api/genres/${id}`);
            expect(res.status).toBe(404);
        });
    })

    describe('POST /', () => {
        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('X-Auth-Token', token)
                .send({ name });
        };

        beforeEach(() => {
            token = new User().generateJwtToken();
            name = 'genre1';
        })
        

        it('should return 401 unauthorized if the client is not logged in', async () => {
            token = '';
            const res = await exec();
            
            expect(res.status).toBe(401);
        })

        it('should return 400 if genre is less than 5 characters', async () => {
            name = '1234';            
            const res = await exec();
            
            expect(res.status).toBe(400);
        })

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a'); 
            const res = await exec();
            
            expect(res.status).toBe(400);
        })

        it('should create genre if it is valid', async () => {           
            await exec();

            const genre = await Genre.find({ name: 'genre1' });
            
            expect(genre).not.toBeNull();
        })

        it('should return genre if it is valid', async () => {           
            const res = await exec();
            
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
        })
    });

    describe('PUT /{id}', () => {
        let token; 
        let newName; 
        let genre; 
        let id; 

        const exec = async () => {
        return await request(server)
            .put('/api/genres/' + id)
            .set('X-Auth-Token', token)
            .send({ name: newName });
        }

        beforeEach(async () => {    
            genre = new Genre({ name: 'genre1' });
            await genre.save();
            
            token = new User().generateJwtToken();     
            id = genre._id; 
            newName = 'updatedName'; 
        })

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        })

        it('should return 400 if id is invalid', async () => {
            id = 1
            const res = await exec();

            expect(res.status).toBe(400);
        })

        it('should return 400 if genre does not exist', async () => {
            id = new mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);
        })

        it('should return 400 if new name is less than 5 characters', async () => {
            newName = '1234';
            const res = await exec();

            expect(res.status).toBe(400);
        })

        it('should return 400 if new name is greater than 50 characters', async () => {
            newName = new Array(52).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        })

        it('should create genre if it is valid', async () => {           
            await exec();

            const genre = await Genre.find({ name: 'genre1' });
            
            expect(genre).not.toBeNull();
        })

        it('should return genre if it is valid', async () => {           
            const res = await exec();
            
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', newName);
        })
    })

    describe('DELETE /{id}', () =>  {
        let genre;
        let token;
        let id;

        beforeEach(async () => {
            genre = new Genre({ name: 'genre1'});
            await genre.save();
            
            id = genre._id; 
            token = new User({ isAdmin: true }).generateJwtToken();
        })

        const exec = () => {
            return request(server)
                .delete('/api/genres/' + id)
                .set('X-Auth-Token', token);
        }

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        })

        it('should return 403 if logged in user is not admin', async () => {
            token = new User({ isAdmin: false }).generateJwtToken();
            const res = await exec();

            expect(res.status).toBe(403);
        })

        it('should return 400 if object id is invalid', async () => {
            id = '1';
            const res = await exec();

            expect(res.status).toBe(400);
        })

        it('should return delete count if it is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('deletedCount', 1);
        })
    })
});