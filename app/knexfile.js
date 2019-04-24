require('ts-node/register');

module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            database: 'appdb',
            user:     'app-user',
            password: 'app-password',
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
