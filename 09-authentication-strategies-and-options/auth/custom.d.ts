import type { JwtPayload } from '@/services/jwt.service'

export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_DATA_SECRET_KEY: string
      APP_JWT_SECRET: string
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: JwtPayload
    }
  }
}
