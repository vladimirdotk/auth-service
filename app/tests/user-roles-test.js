const app = require('./../app');
const request = require('supertest');
const mongoose = require('mongoose');
const utils = require('./../utils');
const User = require('./../models/User');
const Role = require('./../models/Role');

describe('User Roles', () => {
    
    it('fetches user roles list', async () => {
        const username = utils.getRandomName();
        const email = utils.getRandomName() + '@test.ru';
        const password = utils.getRandomName();
        const roleName = utils.getRandomName();

        const newRole = await Role.create({ name: roleName});

        User.createUser(new User({ name: username, email, password }), async (err, newUser) => {
            newUser.roles = [newRole._id];
            await newRole.save();
        
            const response = await request(app)
                .get(`/users/${newUser._id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
        
            const result = JSON.parse(response.text);
            expect(result.userId).toEqual(newUser._id);
            expect(result.roles[0]).toEqual(newRole._id);
            
            await Role.findByIdAndRemove({ _id: newRole._id });
            await User.findByIdAndRemove({ _id: newUser._id });
        });
    });

    it('adds role to user', async () => {
        const name = utils.getRandomName();
        const email = utils.getRandomName() + '@test.ru';
        const password = utils.getRandomName();
        const roleName = utils.getRandomName();

        const newRole = await Role.create({ name: roleName});

        User.createUser(new User({ name, email, password }), async (err, newUser) => {
            const response = await request(app)
                .post(`/users/${newUser._id}/roles/${newRole._id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            
            const result = JSON.parse(response.text);
            expect(
                result.roles.some(role => role.toString() === newRole._id)
            ).toBeTruthy();           
            
            await Role.findByIdAndRemove({ _id: newRole._id });
            await User.findByIdAndRemove({ _id: newUser._id });
        });
    })

    it('deletes role from user', async () => {
        const name = utils.getRandomName();
        const email = utils.getRandomName() + '@test.ru';
        const password = utils.getRandomName();
        const roleName = utils.getRandomName();

        const newRole = await Role.create({ name: roleName});

        User.createUser(new User({ name, email, password }), async (err, newUser) => {
            
            newUser.roles = [newRole._id];
            await newRole.save();

            const response = await request(app)
                .delete(`/users/${newUser._id}/roles/${newRole._id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            
            const result = JSON.parse(response.text);
            expect(
                result.roles
            ).toEqual([]);           
            
            await Role.findByIdAndRemove({ _id: newRole._id });
            await User.findByIdAndRemove({ _id: newUser._id });
        });
    });

    afterAll( async () =>{
        await mongoose.connection.close()
    });
});