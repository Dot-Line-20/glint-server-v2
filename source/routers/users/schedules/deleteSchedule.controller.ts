import HttpError from '@library/httpError'
import { isScheduleExists, prisma } from '@library/prisma'
import { Schedule, User } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: {
      userId: User['id']
    } & Pick<Schedule, 'id'>
  }>,
  reply: FastifyReply
) => {
  if (!(await isScheduleExists(request.params.userId, request.params.id))) {
    reply.callNotFound()

    return
  }

  if (request.params.userId !== request.userId) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  await prisma.schedule.delete({
    where: {
      id: request.params.id,
    },
  })

  reply.send(null)

  return
}
