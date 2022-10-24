import { isScheduleExists, prisma } from '@library/prisma'
import { Prisma, Schedule, User } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Querystring: {
      depth: number
    }
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

  const selection: Prisma.ScheduleSelect = {
    id: true,
    userId: true,
    parentScheduleId: true,
    type: true,
    name: true,
    startingAt: true,
    endingAt: true,
    isSuccess: true,
    createdAt: true,
    categories: true,
    repetitions: true,
  }

  if (typeof request.query.depth === 'number') {
    let currentSelection: Prisma.ScheduleSelect = selection

    while (request.query.depth--) {
      currentSelection.childSchedules = {
        select: Object.assign({}, selection, { childSchedules: false }),
      }

      currentSelection = currentSelection.childSchedules
        .select as Prisma.ScheduleSelect
    }
  }

  reply.send(
    await prisma.schedule.findUnique({
      select: selection,
      where: {
        id: request.params.id,
      },
    })
  )

  return
}
