import prisma from '@library/prisma'
import { PageQuery } from '@library/type'
import { FastifyRequest, PayloadReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Querystring: Partial<PageQuery>
  }>,
  reply: PayloadReply
) => {
  request.query['page[size]'] ||= 50
  request.query['page[index]'] ||= 0

  reply.send({
    status: 'success',
    data: await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        birth: true,
        image: true,
        createdAt: true,
      },
      where: {
        verificationKey: null,
      },
      skip: request.query['page[size]'] * request.query['page[index]'],
      take: request.query['page[size]'],
      orderBy: {
        id: request.query['page[order]'] === 'asc' ? 'asc' : 'desc',
      },
    }),
  })

  return
}
