import app from './../src/app';
import * as request from 'supertest';
import { getRandomName } from './../src/utils';
import { createUser, transactionPerTest } from './helper';
import { IUser } from '../src/models/User';

describe('User', () => {
    transactionPerTest();

    it('fethes users', async () => {
        const newUser = await createUser();
        const response = await request(app)
            .get('/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);

        const users = JSON.parse(response.text);
        const usersFiltered = users.filter((user: IUser) => user.name === newUser.name);
        expect(usersFiltered.length).toEqual(1);
    });

    describe('fetching user', () => {
        it('fetches user by id', async () => {
            const newUser = await createUser();
            const response = await request(app)
                .get(`/users/${newUser.id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            const user = JSON.parse(response.text);
            expect(user.name).toEqual(newUser.name);

        });
        it('failed to fetch user by id', async () => {
            return request(app)
                .get('/users/notExistingUser')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });

    describe('creating user', () => {
        it('creates user', async () => {
            const name = getRandomName();
            const email = `${getRandomName()}@test.ru`;
            const password = getRandomName();
            const response = await request(app)
                .post('/users')
                .set('Accept', 'application/json')
                .send({ name, email, password })
                .expect('Content-Type', /json/)
                .expect(201);

            const user = JSON.parse(response.text);
            expect(user.name).toEqual(name);
            expect(user.email).toEqual(email);
        });
        it('failed to create user', async () => {
            return await request(app)
                .post('/users')
                .set('Accept', 'application/json')
                .send({ name: 1, email: 1, password:1 })
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });

    describe('deleting user', () => {
        it('deletes user', async () => {
            const newUser = await createUser();
            await request(app)
                .delete(`/users/${newUser.id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect('{"message":"user deleted"}');
        });
        it('failed to delete user', async () => {
            return request(app)
                .delete('/users/notExistng')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });
});
