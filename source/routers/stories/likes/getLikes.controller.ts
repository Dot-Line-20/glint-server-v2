import { isStoryExists, prisma } from '@library/prisma'
import { PageQuery } from '@library/type'
import { Story } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Querystring: Partial<Omit<PageQuery, 'order'>>
    Params: {
      storyId: Story['id']
    }
  }>,
  reply: FastifyReply
) => {
  if (!(await isStoryExists(request.params.storyId))) {
    reply.callNotFound()

    return
  }

  request.query['page[size]'] ||= 50
  request.query['page[index]'] ||= 0

  reply.send(
    await prisma.storyLike.findMany({
      select: {
        storyId: true,
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
      where: {
        storyId: request.params.storyId,
      },
      skip: request.query['page[size]'] * request.query['page[index]'],
      take: request.query['page[size]'],
    })
  )

  return
}
