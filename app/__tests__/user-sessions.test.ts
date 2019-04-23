import app from './../src/app';
import * as request from 'supertest';
import { connection } from 'mongoose';
import { createUser, deleteUser, createSession, deleteSession } from './helper';
import { ISessionModel } from '../src/models/Session';

describe('User Sessions', () => {
    describe('fetching user sessions', () => {
        it('fetches user sessions', async () => {
            const user = await createUser();
            const session = await createSession(user._id);
            const response = await request(app)
                .get(`/user-sessions/user/${user._id}/sessions`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            const sessions = JSON.parse(response.text);
            expect(
                sessions.some((sessionData: ISessionModel) => sessionData._id.toString() === session._id.toString()),
            );
            await deleteUser(user._id);
            return deleteSession(session._id);
        });

        it('failed to fetch user sessions', async () => {
            return request(app)
                .get('/user-sessions/user/fakeUser/sessions')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });

    describe('fetching user session', () => {
        it('fetches user session', async () => {
            const user = await createUser();
            const session = await createSession(user._id);
            const response = await request(app)
                .get(`/user-sessions/user/${user._id}/sessions/${session._id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            const userSession = JSON.parse(response.text);
            expect(userSession._id).toBe(session._id.toString());
            await deleteUser(user._id);
            return deleteSession(session._id);
        });
        it('failed to fetch user session', async () => {
            return request(app)
                .get('/user-sessions/user/fakeUser/sessions/fakeSession')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });

    describe('deleting all sessions', () => {
        it('deletes user sessions', async () => {
            const user = await createUser();
            const session = await createSession(user._id);
            const response = await request(app)
                .delete(`/user-sessions/user/${user._id}/sessions`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            const result = JSON.parse(response.text);
            expect(result.message).toBe('success');
            await deleteUser(user._id);
            return deleteSession(session._id);
        });
        it('failed to delete user sessions', async () => {
            return request(app)
                .delete('/user-sessions/user/fakeUser/sessions')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });

    describe('deleting user session', () => {
        it('deletes user session', async () => {
            const user = await createUser();
            const session = await createSession(user._id);
            const response = await request(app)
                .delete(`/user-sessions/user/${user._id}/sessions/${session._id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            const result = JSON.parse(response.text);
            expect(result.message).toBe('success');
            await deleteUser(user._id);
            return deleteSession(session._id);
        });
        it('failed to delete user session', async () => {
            return request(app)
                .delete('/user-sessions/user/fakeUser/sessions/fakeSession')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });

    afterAll(async () => {
        return connection.close();
    });
});
