const app = require('./../app');
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('./../models/User');
const utils = require('./../utils');

describe('Sign in page', () => {
    
    it('renders sign in page', async () => {
        const response = await request(app).get('/auth/signin');
        expect(response.status).toEqual(200);
        expect(response.text).toMatch(/Sign in/);
    });

    it('signs in a user via email/password', async () => {
        const email = utils.getRandomName() + '@test.ru';
        const name = utils.getRandomName();
        const password = utils.getRandomName();
        
        const user = await User.createUser({ email, name, password });
        const response = await request(app)
            .post('/auth/signin')
            .type('form')
            .send({
                email,
                password
            })
            .expect(200);
        expect(response.text).toMatch(/Succsess!/);

        User.findByIdAndDelete({ _id: user._id });
    });

    afterAll( async () =>{
        await mongoose.connection.close()
    });
});