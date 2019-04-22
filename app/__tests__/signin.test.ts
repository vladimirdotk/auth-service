import app from './../src/app';
import * as request from 'supertest';
import { connection } from 'mongoose';
import { getRandomName } from './../src/utils';
import { createUser, deleteUser } from './helper';

describe('Sign in page', () => {
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
        return deleteUser(user._id);
    });

    afterAll(async () => {
        return connection.close();
    });
});
