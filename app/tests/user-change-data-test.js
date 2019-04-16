const app = require('./../app');
const request = require('supertest');
const mongoose = require('mongoose');
const url = require('url');
const helper = require('./helper');

describe('Change user data', () => {
    it('changes name', async () => {
        const user = await helper.createUser();
        const testName = 'TestName';
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

        await helper.deleteUser(user._id);
    });
    afterAll( async () =>{
        await mongoose.connection.close()
    });
});