import app from './../src/app';
import * as request from 'supertest';
import { connection } from 'mongoose';
import { createUser, deleteUser, createRole, deleteRole } from './helper';
import { IRoleModel } from '../src/models/Role';

describe('User Roles', () => {

    it('fetches user roles list', async () => {
        const newRole = await createRole();
        const newUser = await createUser({ roles: [newRole._id] });

        const response = await request(app)
            .get(`/user-roles/user/${newUser._id}/roles`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);

        const result = JSON.parse(response.text);

        expect(result.userId.toString()).toEqual(newUser._id.toString());
        expect(result.roles[0].toString()).toEqual(newRole._id.toString());

        await deleteRole(newRole._id);
        return deleteUser(newUser._id);
    });

    describe('adding role to user', () => {
        it('adds role to user', async () => {
            const newRole = await createRole();
            const newUser = await createUser();

            const response = await request(app)
                .post(`/user-roles/user/${newUser._id}/role/${newRole._id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            const result = JSON.parse(response.text);
            expect(
                (result.roles as IRoleModel['id'][])
                    .some(roleId => roleId.toString() === newRole.id.toString()),
            ).toBeTruthy();

            await deleteRole(newRole._id);
            return deleteUser(newUser._id);
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
            const newUser = await createUser({ roles: [newRole._id] });

            const response = await request(app)
                .delete(`/user-roles/user/${newUser._id}/role/${newRole._id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            const result = JSON.parse(response.text);
            expect(
                result.roles,
            ).toEqual([]);

            await deleteRole(newRole._id);
            return deleteUser(newUser._id);
        });
        it('fails to delete role from user', async () => {
            return request(app)
                .delete('/user-roles/user/fakeUser/role/fakeRole')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });

    afterAll(async () => {
        return connection.close();
    });
});
