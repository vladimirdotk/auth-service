const app = require('./../app');
const request = require('supertest');
const mongoose = require('mongoose');


describe('Sing up page', () => {
    it('renders sing up page', async () => {
        const response = await request(app).get('/auth/signup');
        expect(response.status).toEqual(200);
        expect(response.text).toMatch(/Sign up/);
    });

    it('sings up a user via email/password', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .type('form')
            .send({
                email: Math.random().toString(36).substring(2, 15) + '@test.ru',
                name: 'sdfsd',
                password: '123',
                password2: '123'
            });
        expect(response.text).toMatch(/Succsess!/);
    });

    afterAll( async () =>{
        await mongoose.connection.close()
    });
});