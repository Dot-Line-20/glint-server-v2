import 'dotenv/config'
import { randomBytes } from 'crypto'

export const REQUIRED_ENVIRONMENT_VARIABLE_NAMES = [
  'DATABASE_URL',
  'REDIS_URL',
  'PORT',
  'ARGON_ITERATION',
  'ARGON_MEMORY',
  'ARGON_SALT_LENGTH',
  'ARGON_KEY_LENGTH',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
] as const

for (let i = 0; i < REQUIRED_ENVIRONMENT_VARIABLE_NAMES.length; i++) {
  if (
    typeof process.env[REQUIRED_ENVIRONMENT_VARIABLE_NAMES[i]] === 'undefined'
  ) {
    throw new Error(
      'Unconfigured environment variable: ' +
        REQUIRED_ENVIRONMENT_VARIABLE_NAMES[i]
    )
  }
}

process.env.PORT ||= '3000'

process.env.TZ = 'UTC'

process.env.JWT_SECRET = 'dev' //randomBytes(64).toString('hex')
