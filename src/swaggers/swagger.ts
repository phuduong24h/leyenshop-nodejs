const dotenv = require('dotenv');
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.2' });

dotenv.config();
const port = process.env.PORT || 3000;

const doc = {
  info: {
    title: 'Lê Yên Shop API',
    version: '1.0.0',
    description: 'Hello, have a nice day',
    contact: {
      name: 'Phong Developer',
      url: 'https://www.facebook.com/phong.duong.3570/',
      email: 'phongduong3570@gmail.com'
    },
    license: {
      name: 'FB: fb.com/phong.duong.3570',
      url: 'https://www.facebook.com/phong.duong.3570/'
    }
  },
  servers: [{ url: `http://localhost:${port}` }],
  host: 'localhost:3000',
  basePath: '/',
  swagger: '2.0.0',
  paths: {},
  definitions: {},
  responses: {},
  parameters: {},
  securityDefinitions: {},
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'Bearer ',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const outputFile = './swagger.json';
const routes = ['../index.ts', '../routes/index.ts'];

swaggerAutogen(outputFile, routes, doc);
