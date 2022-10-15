import { prisma } from '@library/prisma'
import { PageQuery } from '@library/type'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Querystring: Partial<PageQuery>
  }>,
  reply: FastifyReply
) => {
  request.query['page[size]'] ||= 50
  request.query['page[index]'] ||= 0

  reply.send(
    await prisma.media.findMany({
      skip: request.query['page[size]'] * request.query['page[index]'],
      take: request.query['page[size]'],
      orderBy: {
        id: request.query['page[order]'] === 'asc' ? 'asc' : 'desc',
      },
    })
  )

  return
}
