const app = require('./../app');
const request = require('supertest');
const mongoose = require('mongoose');
const utils = require('./../utils');
const Role = require('./../models/Role');

describe('/roles', () => {
    
    it('fetches roles list', async () => {
        const name = utils.getRandomName()
        const newRole = await Role.create({ name });
        const response = await request(app)
            .get('/roles')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
        const roles = JSON.parse(response.text);
        expect(
            roles.some(role => role.name === newRole.name)
        ).toBeTruthy();
        await Role.findByIdAndRemove({ _id: newRole._id });
    });

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
        await Role.findByIdAndRemove({ _id: role._id });
    });

    it('deletes a role', async () => {
        const name = utils.getRandomName();
        const newRole = await Role.create({ name });
        const response = await request(app)
            .delete(`/roles/${newRole._id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect('{"message":"success"}')
    });

    afterAll( async () =>{
        await mongoose.connection.close()
    });
});