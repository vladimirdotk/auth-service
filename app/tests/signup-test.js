const app = require('./../app');
const request = require('supertest');
const mongoose = require('mongoose');
const utils = require('./../utils');

describe('Sign up page', () => {
    it('renders sign up page', async () => {
        const response = await request(app).get('/auth/signup');
        expect(response.status).toEqual(200);
        expect(response.text).toMatch(/Sign up/);
    });

    it('signs up a user via email/password', async () => {
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

    it('fails to signup with incorrect email', async () => {
        const password = utils.getRandomName();
        const response = await request(app)
            .post('/auth/signup')
            .type('form')
            .send({
                email: utils.getRandomName(),
                name: utils.getRandomName(),
                password: password,
                password2: password
            })
            .expect('Content-Type', /json/)
            .expect(422)
        const result = JSON.parse(response.text);
        const { errors } = result;
        expect(errors.length).toEqual(1);
        expect(errors[0].param).toMatch("email");
    });

    afterAll( async () =>{
        await mongoose.connection.close()
    });
});