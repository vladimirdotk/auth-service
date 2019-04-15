const app = require('./../app');
const request = require('supertest');
const mongoose = require('mongoose');
const helper = require('./helper');
const utils = require('./../utils');

describe('/roles', () => {
    it('fetches roles list', async () => {
        const newRole = await helper.createRole();
        const response = await request(app)
            .get('/roles')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
        const roles = JSON.parse(response.text);
        expect(
            roles.some(role => role.name === newRole.name)
        ).toBeTruthy();
        await helper.deleteRole(newRole._id);
    });

    describe('adding new role', async () => {
        it('adds new role', async () => {
            const name = utils.getRandomName();
            const response = await request(app)
                .post('/roles')
                .set('Accept', 'application/json')
                .send({ name })
                .expect('Content-Type', /json/)
                .expect(201);
            const role = JSON.parse(response.text);
            expect(role.name).toEqual(name);
            return helper.deleteRole(role._id);
        }); 
        it('fails to add new role (short name)', async () => {
            return request(app)
                .post('/roles')
                .set('Accept', 'application/json')
                .send({ name: 'a' })
                .expect('Content-Type', /json/)
                .expect(422);
        })
    });

    describe('deleting a role', async () => {
        it('deletes a role', async () => {
            const newRole = await helper.createRole();
            await request(app)
                .delete(`/roles/${newRole._id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect('{"message":"success"}')
            await helper.deleteRole(newRole._id);
        });
        it('failes to delete a role', async () => {
            await request(app)
                .delete(`/roles/notExistingRole`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)
        })
    });

    afterAll( async () =>{
        return mongoose.connection.close()
    });
});