import { Router } from 'express'
import { signUp } from './routes/sign-up.router'
import { signIn } from './routes/sign-in.router'
import { signOut } from './routes/sign-out.router'
import { me } from './routes/me.router'
import { ValidationService } from '@/services/validation.service'

const authRouterV1 = Router()

authRouterV1.get('/me', ValidationService.requireAuth, me)
authRouterV1.post('/sign-up', signUp)
authRouterV1.post('/sign-in', signIn)
authRouterV1.post('/sign-out', signOut)

export { authRouterV1 }
