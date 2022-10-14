import { isUserIdExists, prisma } from '@library/prisma'
import { User } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: Pick<User, 'id'>
  }>,
  reply: FastifyReply
) => {
  if (!(await isUserIdExists(request.params.id))) {
    reply.callNotFound()

    return
  }

  reply.send(
    await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        birth: true,
        image: true,
        createdAt: true,
      },
      where: {
        id: request.params.id,
        verificationKey: null,
      },
    })
  )

  return
}
