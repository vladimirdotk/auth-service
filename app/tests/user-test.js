const app = require('./../app');
const request = require('supertest');
const mongoose = require('mongoose');
const utils = require('./../utils');
const helper = require('./helper');

describe('User', () => {
    it('fethes users', async () => {
        const newUser = await helper.createUser();
        const response = await request(app)
            .get('/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);

        const users = JSON.parse(response.text);
        const usersFiltered = users.filter(user => user.name === newUser.name)
        expect(usersFiltered.length).toEqual(1);
        
        return helper.deleteUser(newUser._id);
    });
    
    describe('fetching user', () => {
        it('fetches user by id', async () => {
            const newUser = await helper.createUser();
            const response = await request(app)
                .get(`/users/${newUser._id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
    
            const user = JSON.parse(response.text);
            expect(user.name).toEqual(newUser.name);
            
            return helper.deleteUser(newUser._id);
        });
        it('failed to fetch user by id', async () => {
            return request(app)
                .get('/users/notExistingUser')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
        })    
    });
    
    describe('creating user', () => {
        it('creates user', async () => {
            const name = utils.getRandomName();
            const email = utils.getRandomName() + '@test.ru';
            const password = utils.getRandomName();
            const response = await request(app)
                .post('/users')
                .set('Accept', 'application/json')
                .send({ name, email, password })
                .expect('Content-Type', /json/)
                .expect(201);
    
            const user = JSON.parse(response.text);
            expect(user.name).toEqual(name);
            expect(user.email).toEqual(email);
        
            return helper.deleteUser(user._id);
        });
        it('failed to create user', async () => {
            return await request(app)
                .post('/users')
                .set('Accept', 'application/json')
                .send({ name: 1, email: 1, password:1 })
                .expect('Content-Type', /json/)
                .expect(422);
        })     
    });
    
    describe('deleting user', () => {
        it('deletes user', async () => {
            const newUser = await helper.createUser();
            await request(app)
                .delete(`/users/${newUser._id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect('{"message":"user deleted"}')
            
            await helper.deleteUser(newUser._id);
        });
        it('failed to delete user', async () => {
            return request(app)
                .delete('/users/notExistng')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)
        });      
    });


    afterAll( async () =>{
        await mongoose.connection.close();
    });

});