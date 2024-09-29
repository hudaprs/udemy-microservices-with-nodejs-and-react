import { Router } from 'express'
import { me } from './me.router'

const authRouterV1 = Router()

authRouterV1.get('/me', me)

export { authRouterV1 }
