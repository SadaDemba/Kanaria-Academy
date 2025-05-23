const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Swagger Express API for Kanaria Academy',
            version: '1.0.0',
            description: 'A simple Express API with Swagger documentation',
        },
        servers: [

            {
                url: "http://localhost:3000/",
                description: "Local server",
            },
            {
                url: "", //Url prod
                description: "Production server",
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },

    },
    apis: ['src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
    specs,
    swaggerUi,
};