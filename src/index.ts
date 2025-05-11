import express from 'express';

import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import swaggerUI from 'swagger-ui-express';

import http from 'http';
import path from 'path';

import routes from 'routes';
import swaggerDocument from 'swaggers/swagger.json';
import { connectKnexToPostgreSQL } from 'utils';

dotenv.config();
const app = express();
connectKnexToPostgreSQL();

app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));

const port = process.env.PORT || 3000;
const server = http.createServer(app);

app.set('trust proxy', true);
app.use(helmet());
app.use(cors());
app.use(compression());

app.get('/', (req, res) =>
  res.status(200).json({
    code: 200,
    success: true,
    message: 'Hello 🚀'
  })
);

app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/', routes);

server.listen({ port }, function () {
  console.log(`Server start at port: ${port} 🚀`);
});
