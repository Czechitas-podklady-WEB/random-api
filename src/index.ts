import express from 'express';
import * as dotenv from 'dotenv';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import jsonder from 'jsonder';
import { success, fail } from 'monadix/result';
import { diceroll } from './random.js';

dotenv.config();

const port = process.env.PORT ?? 4000;

const server = express();
const api = jsonder();

server.use('/api', api.middleware());

server.get('/api/diceroll',
  api.endpoint({
    resourceType: 'diceroll',
    handler: (req) => {
      const { act } = req.query;

      if (act === 'shaky') {
        if (Math.random() < 0.5) {
          return fail({
            status: 500,
            code: 'unreliable-dice',
            detail: 'The dice is shaking too much to roll',
          });
        }
      }

      return success({
        id: nanoid(8), 
        number: diceroll()
      });
    },
  }),
);

server.post('/api/login',
  api.endpoint({
    resourceType: 'user',
    validation: {
      bodySchema: z.object({
        email: z.string().email(),
        password: z.string().min(8).max(20),
        acceptTerms: z.boolean(),
      }),
    },
    handler: (req) => {
      const { email, acceptTerms } = req.body;
      const { act } = req.query;

      if (acceptTerms) {
        if (act === 'shaky') {
          if (Math.random() < 0.5) {
            return fail({
              status: 500,
              code: 'server-error',
              detail: 'The server is having trouble',
            });
          }
        }

        return success({
          id: nanoid(8),
          email,
          acceptTerms,
        });
      }

      return fail({
        status: 400,
        code: 'terms-not-accepted',
        detail: 'You must accept the terms and conditions',
      });
    },
  }),
);

server.listen(port, () => {
  console.log(`listening on ${port}...`);
});

