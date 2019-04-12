# Auth Service

## How to start

+ Copy `app/.env.dist` to `app/.env`
+ Change `app/.env` variables
+ Change `docker/mongo/init.js` to create proper database and user/password
+ Run `docker compose up app` for development or `docker-compose up app-test` for testing