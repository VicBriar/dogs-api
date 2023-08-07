const request = require('supertest');
// express app
const app = require('./index');

// db setup
const { sequelize, Dog } = require('./db');
const seed = require('./db/seedFn');
const {dogs} = require('./db/seedData');

describe('Endpoints', () => {
    // to be used in POST test
    const testDogData = {
        breed: 'Borzoi',
        name: 'Sasha',
        color: 'black',
        description: 'a good doggo.'
    };

    beforeAll(async () => {
        // rebuild db before the test suite runs
        await seed();
    });

    describe('GET /dogs', () => {
        it('should return list of dogs with correct data', async () => {
            // make a request
            const response = await request(app).get('/dogs');
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body).toBeDefined();
            // toEqual checks deep equality in objects
            expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
        });
    });

    describe ('POST /dogs', () => {
        it('should create a new dog with correct data', async () => {
            const response = await request(app)
                .post('/dogs')
                .send(testDogData);
            const {breed, color, description, name} = response.body;

            expect(breed).toBe(testDogData.breed);
            expect(color).toBe(testDogData.color);
            expect(description).toBe(testDogData.description);
            expect(name).toBe(testDogData.name);
            expect(response.status).toBe(200)
        })
        it("the created dog should be queryable in the database", async () => {
            const response = await request(app)
                .post('/dogs')
                .send(testDogData);
            const {id} = response.body;
            const dog = await Dog.findOne({where:{id:id}})
            const {breed, color, description, name} = dog;


            expect(breed).toBe(testDogData.breed);
            expect(color).toBe(testDogData.color);
            expect(description).toBe(testDogData.description);
            expect(name).toBe(testDogData.name);
            expect(dog.id).toBeDefined();
        })
    })
});