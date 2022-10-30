import 'dotenv/config'
import { randomBytes } from 'crypto'

export const REQUIRED_ENVIRONMENT_VARIABLE_NAMES = [
  'ARGON_ITERATION',
  'ARGON_KEY_LENGTH',
  'ARGON_MEMORY',
  'ARGON_SALT_LENGTH',
  'DATABASE_URL',
  'DEFAULT_PAGE_SIZE',
  'EMAIL_PASSWORD',
  'EMAIL_USER',
  'MEDIAS_PATH',
  'PORT',
  'REDIS_URL',
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

process.env.JWT_SECRET = randomBytes(64).toString('hex')
