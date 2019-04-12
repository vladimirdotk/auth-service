const app = require('./../app');
const request = require('supertest');
const mongoose = require('mongoose');
const utils = require('./../utils');

describe('Sing up page', () => {
    it('renders sing up page', async () => {
        const response = await request(app).get('/auth/signup');
        expect(response.status).toEqual(200);
        expect(response.text).toMatch(/Sign up/);
    });

    it('sings up a user via email/password', async () => {
        const password = utils.getRandomName();
        const response = await request(app)
            .post('/auth/signup')
            .type('form')
            .send({
                email: utils.getRandomName() + '@test.ru',
                name: utils.getRandomName(),
                password: password,
                password2: password
            });
        expect(response.text).toMatch(/Succsess!/);
    });

    afterAll( async () =>{
        await mongoose.connection.close()
    });
});