import app from './../src/app';
import * as request from 'supertest';
import { getRandomName } from './../src/utils';
import { createUser, transactionPerTest } from './helper';

describe('Sign in page', () => {
    transactionPerTest();

    it('renders sign in page', async () => {
        const response = await request(app).get('/auth/signin');
        expect(response.status).toEqual(200);
        expect(response.text).toMatch(/Sign in/);
    });

    it('signs in a user via email/password', async () => {
        const password = getRandomName();
        const user = await createUser({ password });
        const response = await request(app)
            .post('/auth/signin')
            .type('form')
            .send({
                password,
                email: user.email,
            })
            .expect(200);
        expect(response.text).toMatch(/Succsess!/);
    });
});
