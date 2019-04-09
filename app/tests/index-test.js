const app = require('./../app');
const request = require('supertest');
const mongoose = require('mongoose');

describe('GET / - Index Page', () => {
    it('renders index page', async () => {
        const response = await request(app).get('/');
        expect(response.status).toEqual(200);
        expect(response.text).toMatch(/Express/);
    });
    afterAll( async () =>{
        await mongoose.connection.close()
    });
});