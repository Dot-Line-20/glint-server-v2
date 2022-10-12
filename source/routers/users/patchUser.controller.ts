import { FastifyRequest, PayloadReply } from 'fastify'
import { User } from '@prisma/client'
import { isUserEmailExists, isUserIdExists, prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: Pick<User, 'id'>
    Body: Partial<Omit<User, 'id' | 'verificationKey' | 'createdAt'>>
  }>,
  reply: PayloadReply
) => {
  if (!(await isUserIdExists(request.params.id))) {
    reply.callNotFound()

    return
  }

	if(typeof(request.body.email) === 'string' && await isUserEmailExists(request.body.email)) {
    reply.send(new HttpError(400, 'Duplicated email'))

		return
	}

  if (request.params.id !== request.user.id) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  reply.send(
    await prisma.user.update({
      select: {
        id: true,
        email: true,
        name: true,
        birth: true,
        image: true,
        createdAt: true,
      },
      data: request.body,
      where: request.params,
    })
  )

  return
}
