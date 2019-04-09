const app = require('./../app');
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('./../models/User');


describe('Sing in page', () => {
    it('renders sing in page', async () => {
        const response = await request(app).get('/auth/signin');
        expect(response.status).toEqual(200);
        expect(response.text).toMatch(/Sign in/);
    });

    it('sings in a user via email/password', async () => {
        const email = Math.random().toString(36).substring(2, 15) + '@test.ru';
        const password = '123';
        const newUser = new User({
            email, 
            password
        });
        User.createUser(newUser, async (err) => {
            if (err) {
                throw err;
            }
            const response = await request(app)
                .post('/auth/signin')
                .type('form')
                .send({
                    email,
                    password
                });
            User.deleteOne({email: email});
            expect(response.text).toMatch(/Succsess!/);
        });
    });

    afterAll( async () =>{
        await mongoose.connection.close()
    });
});