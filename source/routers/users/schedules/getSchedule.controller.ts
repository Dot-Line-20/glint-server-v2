import { isScheduleExists, prisma } from '@library/prisma'
import { Prisma, Schedule, User } from '@prisma/client'
import { FastifyRequest, PayloadReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Querystring: {
      depth: number
    }
    Params: {
      userId: User['id']
    } & Pick<Schedule, 'id'>
  }>,
  reply: PayloadReply
) => {
  if (!(await isScheduleExists(request.params.userId, request.params.id))) {
    reply.callNotFound()

    return
  }

  const select: Prisma.ScheduleSelect = {
    id: true,
    userId: true,
    parentScheduleId: true,
    name: true,
    startingAt: true,
    endingAt: true,
    isSuccess: true,
    createdAt: true,
    categories: true,
  }

  if (typeof request.query.depth === 'number') {
    let currentSelect: Prisma.ScheduleSelect = select

    while (request.query.depth--) {
      currentSelect.childSchedules = {
        select: Object.assign({}, select, { childSchedules: false }),
      }

      currentSelect = currentSelect.childSchedules
        .select as Prisma.ScheduleSelect
    }
  }

  reply.send(
    await prisma.schedule.findUnique({
      select: select,
      where: {
        id: request.params.id,
      },
    })
  )

  return
}
