import { Router } from 'express';
import { signUp } from './sign-up.router';
import { signIn } from './sign-in.router';
import { signOut } from './sign-out.router';
import { me } from './me.router';

const authRouterV1 = Router();

authRouterV1.post('/sign-up', signUp);
authRouterV1.post('/sign-in', signIn);
authRouterV1.post('/sign-out', signOut);
authRouterV1.get('/me', me);

export { authRouterV1 };
