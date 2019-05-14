require('ts-node/register');
require('dotenv').config();

module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            host: process.env.POSTGRES_HOST,
            database: process.env.POSTGRES_DB,
            user:     process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },
};
