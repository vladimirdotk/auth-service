import app from './../src/app';
import * as request from 'supertest';
import { getRandomName } from './../src/utils';
import { createRole, transactionPerTest } from './helper';
import { IRole } from './../src/models/Role';

describe('/roles', () => {
    transactionPerTest();

    it('fetches roles list', async () => {
        const newRole = await createRole();
        const response = await request(app)
            .get('/roles')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        const roles = JSON.parse(response.text);
        expect(
            roles.some((role: IRole): boolean => role.name === newRole.name),
        ).toBeTruthy();
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
                .delete(`/roles/${newRole.id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect('{"message":"success"}');
        });
        it('failes to delete a role', async () => {
            await request(app)
                .delete('/roles/notExistingRole')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422);
        });
    });
});
