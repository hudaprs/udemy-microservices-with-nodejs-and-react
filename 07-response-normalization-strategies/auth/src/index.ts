import express from 'express';
import 'express-async-errors';
import { authRouterV1 } from '@/routers/v1/root.router';
import { handleError } from '@/middlewares/error.middleware';

const app = express();

app.use(express.json());

app.use('/api/v1/auth', authRouterV1);

app.all('*', () => {
  throw new Error('Route not found', {
    cause: {
      statusCode: 404,
    },
  });
});

app.use(handleError);

app.listen(3000, () => {
  console.log('Auth started at port 3000');
});
