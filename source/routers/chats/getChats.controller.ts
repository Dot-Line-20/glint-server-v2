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
    await prisma.chat.findMany({
      select: {
        id: true,
        name: true,
        users: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                birth: true,
                media: true,
                createdAt: true,
              },
            },
          },
        },
        createdAt: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
      where: {
        users: {
          some: {
            userId: request.userId,
          },
        },
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
