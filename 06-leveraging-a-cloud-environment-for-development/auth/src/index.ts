import express from 'express';
import { authRouterV1 } from '@/routers/v1/root.router';

const app = express();

app.use(express.json());

app.use('/api/v1/auth', authRouterV1);

app.listen(3000, () => {
  console.log('Auth started at port 3000!!!!');
});
