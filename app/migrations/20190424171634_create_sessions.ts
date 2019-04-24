import * as knex from 'knex';

export const up = (knex: knex, Promise: Promise<any>): knex.SchemaBuilder => {
    return knex.schema.createTable('sessions', (table: knex.TableBuilder) => {
        table.string('sid').primary();
        table.json('sess').notNullable();
        table.timestamp('expired').notNullable();
    });
};

export const down = (knex: knex, Promise: Promise<any>): knex.SchemaBuilder => {
    return knex.schema.dropTable('sessions');
};
