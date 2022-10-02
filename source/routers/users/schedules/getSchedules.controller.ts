import { isUserIdExist } from '@library/existence'
import prisma from '@library/prisma'
import { PageQuery } from '@library/type'
import { Schedule, User } from '@prisma/client'
import { FastifyRequest, PayloadReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: {
      userId: User['id']
    }
    Querystring: Partial<PageQuery & Pick<Schedule, 'isSuccess'>>
  }>,
  reply: PayloadReply
) => {
  if (!(await isUserIdExist(request.params.userId))) {
    reply.callNotFound()

    return
  }

  request.query['page[size]'] ||= 50
  request.query['page[index]'] ||= 0

  reply.send(
    await prisma.schedule.findMany({
      where: {
        user: {
          id: request.params.userId,
          verificationKey: null,
        },
				categories: {
					every: {}
				},
        isSuccess: request.query.isSuccess,
      },
      skip: request.query['page[size]'] * request.query['page[index]'],
      take: request.query['page[size]'],
      orderBy: {
        id: request.query['page[order]'] === 'asc' ? 'asc' : 'desc',
      },
    })
  )

	let a: FastifyRequest | undefined;

	typeof(a)

  return
}
