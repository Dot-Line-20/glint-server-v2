import { prisma } from '@library/prisma'
import { PageQuery } from '@library/type'
import { Category, User } from '@prisma/client'
import { FastifyRequest, PayloadReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Querystring: Partial<
      {
        userId: User['id']
        categoryId: Category['id']
      } & PageQuery
    >
  }>,
  reply: PayloadReply
) => {
  request.query['page[size]'] ||= 50
  request.query['page[index]'] ||= 0

  reply.send(
    await prisma.post.findMany({
      select: {
        id: true,
        userId: true,
        title: true,
        content: true,
        createdAt: true,
        postMedias: true,
      },
      where: {
        isDeleted: false,
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
