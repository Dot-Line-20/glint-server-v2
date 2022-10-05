import { isScheduleExist } from '@library/existence'
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
  if (!(await isScheduleExist(request.params.id))) {
    reply.callNotFound()

    return
  }

  reply.send(
    await prisma.schedule.findUnique({
      where: {
        id: request.params.id,
      },
			include: {
				categories: {
					include: {
						category: true
					}
				}
			}
    })
  )

  return
}
