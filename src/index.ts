import express from 'express';
import * as dotenv from 'dotenv';
import jsonder from 'jsonder';
import { success } from 'monadix/result';
import { diceroll } from './random.js';

dotenv.config();

const port = process.env.PORT ?? 4000;

const server = express();
const api = jsonder();

server.use('/api', api.middleware());

server.get('/api/diceroll',
  api.endpoint({
    resourceType: 'diceroll',
    handler: () => success({
      id: '', 
      number: diceroll()
    }),
  }),
);

server.listen(port, () => {
  console.log(`listening on ${port}...`);
});

