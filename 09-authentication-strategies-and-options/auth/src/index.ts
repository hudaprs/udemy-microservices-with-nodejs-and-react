import express from 'express'
import 'express-async-errors'
import { authRouterV1 } from '@/routers/v1/root.router'
import { ValidationService } from './services/validation.service'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'

const app = express()

if (!process.env.APP_DATA_SECRET_KEY)
  throw new Error('Please define APP_DATA_SECRET_KEY inside env')
if (!process.env.APP_JWT_SECRET)
  throw new Error('Please define APP_JWT_SECRET inside env')

app.set('trust proxy', true)

app.use(express.json())

app.use(
  cookieSession({
    signed: false,
    secure: false
  })
)

app.use('/api/v1/auth', authRouterV1)

app.all('*', () => {
  throw new Error('Route not found', {
    cause: {
      statusCode: 404
    }
  })
})

try {
  await mongoose.connect('mongodb://auth-mongo-service:27017/auth')
  console.log('Database connected')
} catch (err) {
  if (err instanceof Error) {
    console.error('Database Error: ', err.message)
  }
}

app.use(ValidationService.handleError)

app.listen(3000, () => {
  console.log('Auth started at port 3000')
})
