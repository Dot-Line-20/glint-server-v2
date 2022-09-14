import HttpError from '@library/httpError'
import prisma from '@library/prisma'
import { User } from '@prisma/client'
import { FastifyRequest, PayloadReply } from 'fastify'
import { sign } from 'jsonwebtoken'
import { verify } from 'argon2'

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
    status: 'success',
    data: {
      refreshToken: sign(
        {
          id: user.id,
        },
        user.password,
        {
          expiresIn: '90d',
        }
      ),
      accessToken: sign(
        {
          id: user.id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      ),
    },
  })

  return
}
