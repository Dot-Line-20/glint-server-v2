import HttpError from '@library/httpError'
import prisma from '@library/prisma'
import { User } from '@prisma/client'
import { FastifyRequest, PayloadReply } from 'fastify'
import { verify } from 'argon2'
import JsonWebToken from '@library/jsonwebtoken'
import { getEpoch } from '@library/utility'

export default async (
  request: FastifyRequest<{
    Body: Pick<User, 'email' | 'password'>
  }>,
  reply: PayloadReply
) => {
  const user: Pick<User, 'id' | 'password' | 'verificationKey'> | null =
    await prisma.user.findUnique({
      select: {
        id: true,
        password: true,
        verificationKey: true,
      },
      where: {
        email: request.body.email,
      },
    })

  if (user === null) {
    reply.send(new HttpError(400, 'Invalid email'))

    return
  }

  if (!(await verify(user.password, request.body.password))) {
    reply.send(new HttpError(400, 'Invalid password'))

    return
  }

  if (user.verificationKey !== null) {
    reply.send(new HttpError(400, 'Unverified email'))

    return
  }

  reply.send({
    refreshToken: JsonWebToken.create(
      {
        id: user.id,
        exp: getEpoch() + 7776000, // 90d
      },
      user.password
    ),
    accessToken: JsonWebToken.create(
      {
        id: user.id,
        exp: getEpoch() + 3600, // 1h
      },
      process.env.JWT_SECRET
    ),
  })

  return
}
