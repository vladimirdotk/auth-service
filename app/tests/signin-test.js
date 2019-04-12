const app = require('./../app');
const request = require('supertest');
const mongoose = require('mongoose');
const utils = require('./../utils');
const helper = require('./helper');

describe('Sign in page', () => {
    
    it('renders sign in page', async () => {
        const response = await request(app).get('/auth/signin');
        expect(response.status).toEqual(200);
        expect(response.text).toMatch(/Sign in/);
    });

    it('signs in a user via email/password', async () => {
        const password = utils.getRandomName();
        const user = await helper.createUser({ password });
        const response = await request(app)
            .post('/auth/signin')
            .type('form')
            .send({
                email: user.email,
                password: password
            })
            .expect(200);
        expect(response.text).toMatch(/Succsess!/);

        await helper.deleteUser(user._id);
    });

    afterAll( async () =>{
        await mongoose.connection.close()
    });
});