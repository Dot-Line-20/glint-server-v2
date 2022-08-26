import { REQUIRED_ENVIRONMENT_VARIABLE_NAMES } from '@library/environment'

declare global {
  namespace NodeJS {
    interface ProcessEnv
      extends Record<
        typeof REQUIRED_ENVIRONMENT_VARIABLE_NAMES[number],
        string
      > {
      NODE_ENV: 'development' | 'production'
      JWT_SECRET: string
    }
  }
}

export {}
