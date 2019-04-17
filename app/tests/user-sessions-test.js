const app = require('./../app');
const request = require('supertest');
const mongoose = require('mongoose');
const helper = require('./helper');

describe('User Sessions', function () {
    
    describe('fetching user sessions', function () {
        it('fetches user sessions', async () => {
            const user = await helper.createUser();
            const session = await helper.createSession(user._id);
            const response = await request(app)
                .get(`/user-sessions/user/${user._id}/sessions`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            const sessions = JSON.parse(response.text);
            expect(sessions.some(sessionData => sessionData._id.toString() === session._id.toString()));
            await helper.deleteUser(user._id);
            return helper.deleteSession(session._id);
        });
       
        it('failed to fetch user sessions', async () => {
            return request(app)
                .get(`/user-sessions/user/fakeUser/sessions`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });
    
    describe('fetching user session', function () {
        it('fetches user session', async () => {
            const user = await helper.createUser();
            const session = await helper.createSession(user._id);
            const response = await request(app)
                .get(`/user-sessions/user/${user._id}/sessions/${session._id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            const userSession = JSON.parse(response.text);
            expect(userSession._id).toBe(session._id.toString());
            await helper.deleteUser(user._id);
            return helper.deleteSession(session._id);
        });
        it('failed to fetch user session', async () => {
            return request(app)
                .get('/user-sessions/user/fakeUser/sessions/fakeSession')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });
    

    afterAll( async () =>{
        return mongoose.connection.close()
    });
});
