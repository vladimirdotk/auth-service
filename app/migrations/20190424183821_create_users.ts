import * as knex from 'knex';

export const up = (knex: knex, Promise: Promise<any>): knex.SchemaBuilder => {
    return knex.schema.createTable('users', (table: knex.TableBuilder) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email');
        table.string('password');
        table.string('githubId');
        table.string('googleId');
        table.string('confirmCode');
    });
};

export const down = (knex: knex, Promise: Promise<any>): knex.SchemaBuilder => {
    return knex.schema.dropTable('users');
};
