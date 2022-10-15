import { prisma } from '@library/prisma'
import { FastifyRequest, FastifyReply } from 'fastify'
import { User } from '@prisma/client'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Querystring: {
      verificationKey: string
    }
  }>,
  reply: FastifyReply
) => {
  const user: Pick<User, 'id'> | null = await prisma.user.findUnique({
    select: {
      id: true,
    },
    where: {
      verificationKey: request.query.verificationKey,
    },
  })

  if (user === null) {
    reply.send(new HttpError(400, 'Invalid verificationKey'))

    return
  }

  await prisma.user.update({
    data: {
      verificationKey: null,
    },
    where: {
      id: user.id,
    },
  })

  // TODO: Replace redirect url with login page
  reply.redirect(307, 'https://dot-line-20.github.io/glint-flutter/#/login')
}
