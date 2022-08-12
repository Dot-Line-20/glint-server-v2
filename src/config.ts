import 'dotenv/config'

const check = (key: string, defaultValue?: string): string => {
  if (typeof process.env[key] === 'undefined') {
    if (typeof defaultValue === 'undefined') {
      throw new Error(`${key} is not defined in .env`)
    }
    return defaultValue
  }
  return process.env[key] as string
}

export default {
  port: check('PORT', '3000'),
  
  jwtSecret: check('JWT_SECRET'),
  jwtAccessLife: check('JWT_ACCESS_LIFE', '1h'),
  jwtRefreshLife: check('JWT_REFRESH_LIFE', '1m'),

  storeId: check('STORE_ID'),
  storeKey: check('STORE_KEY'),
}
