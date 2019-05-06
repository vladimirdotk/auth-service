import app from './../src/app';
import * as request from 'supertest';
import { createUser, createRole, transactionPerTest, createUserRole } from './helper';
import { IRole } from '../src/models/Role';

describe('User Roles', () => {
    transactionPerTest();

    it('fetches user roles list', async () => {
        const newRole = await createRole();
        const newUser = await createUser();
        await createUserRole(newUser.id, newRole.id);

        const response = await request(app)
            .get(`/user-roles/user/${newUser.id}/roles`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);

        const result = JSON.parse(response.text);

        expect(result[0].userId).toEqual(newUser.id);
        expect(result[0].roleId).toEqual(newRole.id);
    });

    describe('adding role to user', () => {
        it('adds role to user', async () => {
            const newRole = await createRole();
            const newUser = await createUser();

            const response = await request(app)
                .post(`/user-roles/user/${newUser.id}/role/${newRole.id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            const result = JSON.parse(response.text);

            expect(result[0].userId).toEqual(newUser.id);
            expect(result[0].roleId).toEqual(newRole.id);
        });

        it('fails to add role to user', async () => {
            return request(app)
                .post('/user-roles/user/fakeUser/role/fakeRole')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });

    describe('deleting role from user', () => {
        it('deletes role from user', async () => {
            const newRole = await createRole();
            const newUser = await createUser();
            await createUserRole(newUser.id, newRole.id);

            const response = await request(app)
                .delete(`/user-roles/user/${newUser.id}/role/${newRole.id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            const result = JSON.parse(response.text);
            expect(
                result,
            ).toEqual([]);
        });
        it('fails to delete role from user', async () => {
            return request(app)
                .delete('/user-roles/user/fakeUser/role/fakeRole')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });
});
