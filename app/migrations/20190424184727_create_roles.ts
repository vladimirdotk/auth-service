import * as knex from 'knex';

export const up = (knex: knex, Promise: Promise<any>): knex.SchemaBuilder => {
    return knex.schema.createTable('roles', (table: knex.TableBuilder) => {
        table.increments('id').unsigned().primary();
        table.string('name').notNullable().unique();
    });
};

export const down = (knex: knex, Promise: Promise<any>): knex.SchemaBuilder => {
    return knex.schema.dropTable('roles');
};
