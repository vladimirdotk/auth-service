import * as knex from 'knex';

export const up = (knex: knex, Promise: Promise<any>): knex.SchemaBuilder => {
    return knex.schema.createTable('user_roles', (table: knex.TableBuilder) => {
        table.increments('id').unsigned().primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').index();
        table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE');
    });
};

export const down = (knex: knex, Promise: Promise<any>): knex.SchemaBuilder => {
    return knex.schema.dropTable('user_roles');
};
