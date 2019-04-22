import app from './../src/app';
import * as request from 'supertest';
import { connection } from 'mongoose';
import { getRandomName } from './../src/utils';

describe('Sign up page', () => {
    it('renders sign up page', async () => {
        const response = await request(app).get('/auth/signup');
        expect(response.status).toEqual(200);
        expect(response.text).toMatch(/Sign up/);
    });

    it('signs up a user via email/password', async () => {
        const password = getRandomName();
        const response = await request(app)
            .post('/auth/signup')
            .type('form')
            .send({
                password,
                password2: password,
                email: `${getRandomName()}@test.ru`,
                name: getRandomName(),
            });
        expect(response.text).toMatch(/Succsess!/);
    });

    it('fails to signup with incorrect email', async () => {
        const password = getRandomName();
        const response = await request(app)
            .post('/auth/signup')
            .type('form')
            .send({
                password,
                password2: password,
                email: getRandomName(),
                name: getRandomName(),
            })
            .expect('Content-Type', /json/)
            .expect(422);
        const result = JSON.parse(response.text);
        const { message } = result;
        expect(message.length).toEqual(1);
        expect(message[0].param).toMatch('email');
    });

    afterAll(async () => {
        return connection.close();
    });
});
