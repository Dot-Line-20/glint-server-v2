import { isUserExists, prisma } from '@library/prisma'
import { PageQuery } from '@library/type'
import { Prisma, Schedule, User } from '@prisma/client'
import { FastifyRequest, PayloadReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: {
      userId: User['id']
    }
    Querystring: Partial<
      { depth: number; isParent: boolean; isEnded: boolean } & Pick<
        Schedule,
        'isSuccess'
      > &
        PageQuery
    >
  }>,
  reply: PayloadReply
) => {
  if (!(await isUserExists(request.params.userId))) {
    reply.callNotFound()

    return
  }

  request.query['page[size]'] ||= 50
  request.query['page[index]'] ||= 0

  const endingAtCondition: Prisma.DateTimeFilter = {}

  if (typeof request.query.isEnded === 'boolean') {
    endingAtCondition[request.query.isEnded ? 'lte' : 'gte'] = new Date()
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
        where: {
          endingAt: endingAtCondition,
        },
      }

      currentSelect = currentSelect.childSchedules
        .select as Prisma.ScheduleSelect
    }
  }

  reply.send(
    await prisma.schedule.findMany({
      select: select,
      where: {
        userId: request.params.userId,
        isSuccess: request.query.isSuccess,
        parentScheduleId:
          typeof request.query.isParent === 'boolean' && request.query.isParent
            ? null
            : undefined,
        endingAt: endingAtCondition,
      },
      skip: request.query['page[size]'] * request.query['page[index]'],
      take: request.query['page[size]'],
      orderBy: {
        id: request.query['page[order]'] === 'asc' ? 'asc' : 'desc',
      },
    })
  )

  return
}
