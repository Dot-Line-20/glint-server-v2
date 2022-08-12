import crypto from 'crypto'
import config from '../config'
import jwt from 'jsonwebtoken'
import { HttpError } from 'lib/error'
import { Prisma } from '@prisma/client'
import {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from 'jsonwebtoken'

interface Payload {
  id: string
  refresh: boolean
}

export const sha256 = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export const issue = (id: string) => {
  return {
    accessToken: jwt.sign({ id, refresh: false }, config.jwtSecret, {
      expiresIn: config.jwtAccessLife,
    }),
    refreshToken: jwt.sign({ id, refresh: true }, config.jwtSecret, {
      expiresIn: config.jwtRefreshLife,
    }),
  }
}

export const getTokenType = () => {}

export const verify = (
  token: string | undefined,
  refresh: boolean
): Payload => {
  try {
    if (typeof token === 'undefined') {
      throw new HttpError(401, '토큰이 필요합니다.', 'TOKEN_REQUIRED')
    }

    const payload = jwt.verify(token, config.jwtSecret) as Payload

    if (payload.refresh !== refresh) {
      throw new HttpError(
        401,
        '토큰 타입이 일치하지 않습니다.',
        'TOKEN_TYPE_MISMATCH'
      )
    }

    return payload
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new HttpError(401, '토큰이 만료되었습니다.', 'TOKEN_EXPIRED')
    }

    if (error instanceof JsonWebTokenError || error instanceof NotBeforeError) {
      throw new HttpError(401, '토큰이 유효하지 않습니다.', 'TOKEN_INVALID')
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new HttpError(
        401,
        '사용자를 확인하는데 실패했습니다.',
        'TOKEN_FAILED'
      )
    }

    throw error
  }
}
