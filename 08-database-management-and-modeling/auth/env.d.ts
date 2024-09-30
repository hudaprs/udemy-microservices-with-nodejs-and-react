export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_DATA_SECRET_KEY: string
    }
  }
}
