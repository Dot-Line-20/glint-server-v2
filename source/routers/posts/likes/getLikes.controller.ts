import { isPostExists, prisma } from '@library/prisma'
import { PageQuery } from '@library/type'
import { Post } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Querystring: Partial<Omit<PageQuery, 'order'>>
    Params: {
      postId: Post['id']
    }
  }>,
  reply: FastifyReply
) => {
  if (!(await isPostExists(request.params.postId))) {
    reply.callNotFound()

    return
  }

  request.query['page[size]'] ||= 50
  request.query['page[index]'] ||= 0

  reply.send(
    await prisma.postLike.findMany({
      select: {
        postId: true,
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
        postId: request.params.postId,
      },
      skip: request.query['page[size]'] * request.query['page[index]'],
      take: request.query['page[size]'],
    })
  )

  return
}
