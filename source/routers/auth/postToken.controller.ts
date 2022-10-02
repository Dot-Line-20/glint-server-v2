import HttpError from '@library/httpError'
import prisma from '@library/prisma'
import { FastifyRequest, PayloadReply } from 'fastify'
import { User } from '@prisma/client'
import JsonWebToken from '@library/jsonwebtoken'
import { getEpoch } from '@library/utility'

export default async (
  request: FastifyRequest<{
    Body: { refreshToken: string }
  }>,
  reply: PayloadReply
) => {
  const jsonWebToken: JsonWebToken = new JsonWebToken(
    request.body.refreshToken,
    ''
  )

  if (jsonWebToken.payload === null) {
    reply.send(new HttpError(400, 'Invalid refreshToken'))

    return
  }

  const user: Pick<User, 'password'> | null = await prisma.user.findUnique({
    select: {
      password: true,
    },
    where: {
      id: jsonWebToken.payload.id,
    },
  })

  if (user === null) {
    reply.send(new HttpError(400, 'Invalid refreshToken'))

    return
  }

  jsonWebToken.secretKey = user.password

  if (!jsonWebToken.isValid()) {
    reply.send(new HttpError(400, 'Invalid refreshToken'))

    return
  }

  reply.send({
    refreshToken: request.body.refreshToken,
    accessToken: JsonWebToken.create(
      {
        id: jsonWebToken.payload.id,
        exp: getEpoch() + 3600, // 1h
      },
      process.env.JWT_SECRET
    ),
  })

  return
}
