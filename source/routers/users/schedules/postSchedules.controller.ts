import { FastifyRequest, PayloadReply } from 'fastify'
import { Schedule, User } from '@prisma/client'
import prisma from '@library/prisma'
import HttpError from '@library/httpError'
import { isUserIdExist } from '@library/existence'

export default async (
  request: FastifyRequest<{
    Params: {
      userId: User['id']
    }
    Body: Pick<
      Schedule,
      'parentScheduleId' | 'name' | 'startingAt' | 'endingAt'
    >
  }>,
  reply: PayloadReply
) => {
  if (!(await isUserIdExist(request.params.userId))) {
    reply.callNotFound()

    return
  }

  if (request.params.userId !== request.user.id) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  if (
    request.body.parentScheduleId !== null &&
    (await prisma.schedule.findUnique({
      select: null,
      where: {
        id: request.body.parentScheduleId,
      },
    })) === null
  ) {
    reply.send(new HttpError(400, 'Invalid parentScheduleId'))

    return
  }

  reply.send(
    await prisma.schedule.create({
      select: {
        id: true,
      },
      data: Object.assign(request.body, {
        userId: request.params.userId,
        startingAt: new Date(request.body.startingAt),
        endingAt: new Date(request.body.endingAt),
      }),
    })
  )

  return
}
