const app = require('./../app');
const utils = require('./../utils');
const User = require('./../models/User');
const request = require('supertest');
const mongoose = require('mongoose');

describe('Change user data', () => {
    it('changes name', async () => {
        const name = utils.getRandomName();
        const email = utils.getRandomName() + '@test.ru';
        const password = utils.getRandomName();
        const testName = 'TestName';

        User.createUser(new User({ name, email, password }), async (err, newUser) => {
            const response = await request(app)
                .patch(`/user/${newUser._id}`)
                .set('Accept', 'application/json')
                .send({ name: testName })
                .expect('Content-Type', /json/)
                .expect(200);
            
            const confirmUrl = JSON.parse(response.text).url;

            const confirmResponse = await request(app)
                .get(confirmUrl)
                .set('Accept', 'application/json')
                .send({ name: "TestName" })
                .expect('Content-Type', /json/)
                .expect(200);
            
            const result = JSON.parse(confirmResponse.text);
            expect(result.name).toEqual(newUser.testName);

            await User.findByIdAndRemove({ _id: newUser._id });
        });
    });
    afterAll( async () =>{
        await mongoose.connection.close()
    });
});