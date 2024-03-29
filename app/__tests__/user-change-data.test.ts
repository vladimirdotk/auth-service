import app from './../src/app';
import * as request from 'supertest';
import url = require('url');
import { createUser, transactionPerTest } from './helper';

describe('Change user data', () => {
    transactionPerTest();

    it('changes name', async () => {
        const user = await createUser();
        const testName = 'TestName';
        const response = await request(app)
            .patch(`/users/${user.id}`)
            .set('Accept', 'application/json')
            .send({ name: testName })
            .expect('Content-Type', /json/)
            .expect(200);
        const confirmUrl = JSON.parse(response.text).url;
        const confirmUrlPath = url.parse(confirmUrl).path;
        const confirmResponse = await request(app)
            .get(confirmUrlPath!)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        const result = JSON.parse(confirmResponse.text);
        expect(result.user.name).toEqual(testName);
    });
});
