const request = require('supertest');
const moment = require('moment');
const { Rental } = require('../../models/Rental');
const { User } = require('../../models/User');
const mongoose = require('mongoose');
const { Movie } = require('../../models/Movie');
const { Genre } = require('../../models/Genre');

let server;

afterAll(async () => await mongoose.disconnect());

describe('POST api/return', () => {

    let token;
    let movieId;
    let customerId;
    let rental;
    let payload;
    let movie;
    let genre;

    beforeEach(async () => {
        server = require('../../index');

        movieId = new mongoose.Types.ObjectId();
        customerId = new mongoose.Types.ObjectId();
        genreId = new mongoose.Types.ObjectId();
        payload = { customerId, movieId };
        token = new User().generateJwtToken();
        
        genre = new Genre( {name: '12345'});
        genre = await genre.save();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 10,
            genre: [ genre._id ],
            numberInStock: 10
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 10
            }
        });

        await rental.save();
    })

    afterEach(async () => { 
        await server.close(); 
        await Rental.deleteMany({});
        await Movie.deleteMany({});
        await Genre.deleteMany({});
    });

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('X-Auth-Token', token)
            .send(payload);
    }

    it('should return 401 if user is not logged in', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    })

    it('should return 400 if customer_id is not provided', async () => {
        delete payload.customerId;

        const res = await exec();

        expect(res.status).toBe(400);
    })

    it('should return 400 if movie_id is not provided', async () => {
        delete payload.movieId;
        
        const res = await exec();

        expect(res.status).toBe(400);
    })

    it('should return 404 if there is no retal with movie_id and customer_id pair', async () => {
        await Rental.deleteMany({});

        const res = await exec();

        expect(res.status).toBe(404);
    })

    it('should return 400 if rental is already returned', async () => {
        rental.dateReturn = Date.now();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    })

    it('should return 200 if valid request', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    })

    it('should return rental if valid request', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        const movieInDb = await Movie.findById(movie._id);
        const diff = new Date() - rentalInDb.dateReturn;

        expect(diff).toBeLessThan(10 * 1000);
        expect(rentalInDb.rentalFee).toBe(70);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);

        const expectFields = [ 'customer', 'movie', 'dateOut', 'dateReturn', 'rentalFee'];
        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(expectFields));
    })
})


