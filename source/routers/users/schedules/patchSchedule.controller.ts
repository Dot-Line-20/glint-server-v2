import { FastifyRequest, PayloadReply } from 'fastify'
import { Schedule, User } from '@prisma/client'
import prisma from '@library/prisma'
import HttpError from '@library/httpError'
import { isScheduleExist } from '@library/existence'

export default async (
  request: FastifyRequest<{
    Params: {
      userId: User['id']
    } & Pick<Schedule, 'id'>
    Body: Partial<
      Pick<
        Schedule,
        'parentScheduleId' | 'name' | 'startingAt' | 'endingAt' | 'isSuccess'
      >
    >
  }>,
  reply: PayloadReply
) => {
  if (!(await isScheduleExist(request.params.id))) {
    reply.callNotFound()

    return
  }

  if (request.params.userId !== request.user.id) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  reply.send(
    await prisma.schedule.update({
      data: request.body,
      where: {
				id: request.params.id
			},
    })
  )

  return
}
