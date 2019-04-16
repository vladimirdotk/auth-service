const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        info: {
            title: 'Auth Servce',
            version: '1.0.0',
        },
        host: process.env.SWAGGER_HOST,
        basePath: '/'
    },
    apis: ['routes/*.js'],
};

module.exports = swaggerJSDoc(options);