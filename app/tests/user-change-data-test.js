const app = require('./../app');
const utils = require('./../utils');
const User = require('./../models/User');
const request = require('supertest');
const mongoose = require('mongoose');
const url = require('url');

describe('Change user data', () => {
    it('changes name', async () => {
        const name = utils.getRandomName();
        const email = utils.getRandomName() + '@test.ru';
        const password = utils.getRandomName();
        const testName = 'TestName';
        
        const user = await User.createUser({ name, email, password });
        const response = await request(app)
            .patch(`/users/${user._id}`)
            .set('Accept', 'application/json')
            .send({ name: testName })
            .expect('Content-Type', /json/)
            .expect(200);
            
        const confirmUrl = JSON.parse(response.text).url;
        const confirmUrlPath = url.parse(confirmUrl).path;
        
        const confirmResponse = await request(app)
            .get(confirmUrlPath)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        
        const result = JSON.parse(confirmResponse.text);
        expect(result.name).toEqual(user.testName);

        await User.findByIdAndRemove({ _id: user._id });
    });
    afterAll( async () =>{
        await mongoose.connection.close()
    });
});