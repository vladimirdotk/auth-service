const app = require('./../app');
const request = require('supertest');
const mongoose = require('mongoose');
const helper = require('./helper');

describe('User Roles', () => {
    
    it('fetches user roles list', async () => {
        const newRole = await helper.createRole();
        const newUser = await helper.createUser({ roles: [newRole._id]});

        const response = await request(app)
            .get(`/user-roles/user/${newUser._id}/roles`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
    
        const result = JSON.parse(response.text);
        
        expect(result.userId.toString()).toEqual(newUser._id.toString());
        expect(result.roles[0].toString()).toEqual(newRole._id.toString());
        
        await helper.deleteRole(newRole._id);
        await helper.deleteUser(newUser._id);
    });

    it('adds role to user', async () => {
        const newRole = await helper.createRole();
        const newUser = await helper.createUser();

        const response = await request(app)
            .post(`/user-roles/user/${newUser._id}/role/${newRole._id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
    
        const result = JSON.parse(response.text);
        result.roles.some(role => role.email === newRole.email)
        expect(
            result.roles.some(role => role.toString() == newRole._id)
        ).toBeTruthy();           
        
        await helper.deleteRole(newRole._id);
        await helper.deleteUser(newUser._id);
    })

    it('deletes role from user', async () => {
        const newRole = await helper.createRole();
        const newUser = await helper.createUser({ roles: [newRole._id]});

        const response = await request(app)
            .delete(`/user-roles/user/${newUser._id}/role/${newRole._id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        
        const result = JSON.parse(response.text);
        expect(
            result.roles
        ).toEqual([]);           
        
        await helper.deleteRole(newRole._id);
        await helper.deleteUser(newUser._id);
    });

    afterAll( async () =>{
        await mongoose.connection.close()
    });
});