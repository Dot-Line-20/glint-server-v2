import { isScheduleExists } from '@library/existence'
import HttpError from '@library/httpError'
import prisma from '@library/prisma'
import { Schedule, User } from '@prisma/client'
import { FastifyRequest, PayloadReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: {
      userId: User['id']
    } & Pick<Schedule, 'id'>
  }>,
  reply: PayloadReply
) => {
  if (!(await isScheduleExists(request.params.id))) {
    reply.callNotFound()

    return
  }

  if (request.params.userId !== request.user.id) {
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
