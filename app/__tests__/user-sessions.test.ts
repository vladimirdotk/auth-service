import app from './../src/app';
import * as request from 'supertest';
import { createUser, createSession, transactionPerTest} from './helper';

describe('User Sessions', () => {
    transactionPerTest();

    describe('fetching user sessions', () => {
        it('fetches user sessions', async () => {
            const user = await createUser();
            const session = await createSession(<number>user.id);
            const response = await request(app)
                .get(`/user-sessions/user/${user.id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            const sessions = JSON.parse(response.text);
            expect(sessions[0].sid).toBe(session.sid);
        });

        it('failed to fetch user sessions', async () => {
            return request(app)
                .get('/user-sessions/user/fakeUser')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });

    describe('fetching user session', () => {
        it('fetches user session', async () => {
            const user = await createUser();
            const session = await createSession(<number>user.id);
            const response = await request(app)
                .get(`/user-sessions/user/${user.id}/session/${session.sid}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            const userSession = JSON.parse(response.text);
            expect(userSession.sid).toBe(session.sid);
        });
        it('failed to fetch user session', async () => {
            return request(app)
                .get('/user-sessions/user/fakeUser/session/fakeSession')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });

    describe('deleting all sessions', () => {
        it('deletes user sessions', async () => {
            const user = await createUser();
            await createSession(<number>user.id);
            const response = await request(app)
                .delete(`/user-sessions/user/${user.id}/sessions`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            const result = JSON.parse(response.text);
            expect(result.message).toBe('success');
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
            const session = await createSession(<number>user.id);
            const response = await request(app)
                .delete(`/user-sessions/user/${user.id}/session/${session.sid}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            const result = JSON.parse(response.text);
            expect(result.message).toBe('success');
        });
        it('failed to delete user session', async () => {
            return request(app)
                .delete('/user-sessions/user/fakeUser/session/fakeSession')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });
});
