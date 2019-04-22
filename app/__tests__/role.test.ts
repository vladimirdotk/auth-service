import app from './../src/app';
import * as request from 'supertest';
import { connection } from 'mongoose';
import { getRandomName } from './../src/utils';
import { createUser, deleteUser, createRole, deleteRole } from './helper';
import { IRoleModel } from './../src/models/Role';

describe('/roles', () => {
    it('fetches roles list', async () => {
        const newRole = await createRole();
        const response = await request(app)
            .get('/roles')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        const roles = JSON.parse(response.text);
        expect(
            roles.some((role: IRoleModel): boolean => role.name === newRole.name),
        ).toBeTruthy();
        return deleteRole(newRole._id);
    });

    describe('adding new role', () => {
        it('adds new role', async () => {
            const name = getRandomName();
            const response = await request(app)
                .post('/roles')
                .set('Accept', 'application/json')
                .send({ name })
                .expect('Content-Type', /json/)
                .expect(201);
            const role = JSON.parse(response.text);
            expect(role.name).toEqual(name);
            return deleteRole(role._id);
        });

        it('fails to add new role (short name)', async () => {
            return request(app)
                .post('/roles')
                .set('Accept', 'application/json')
                .send({ name: 'a' })
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });

    describe('deleting a role', () => {
        it('deletes a role', async () => {
            const newRole = await createRole();
            await request(app)
                .delete(`/roles/${newRole._id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect('{"message":"success"}');
            await deleteRole(newRole._id);
        });
        it('failes to delete a role', async () => {
            await request(app)
                .delete('/roles/notExistingRole')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });

    afterAll(async () => {
        return connection.close();
    });
});
