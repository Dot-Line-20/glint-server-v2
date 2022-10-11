import { isPostExists, prisma } from '@library/prisma'
import { PageQuery } from '@library/type'
import { Post } from '@prisma/client'
import { FastifyRequest, PayloadReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: {
      postId: Post['id']
    }
    Querystring: Partial<PageQuery>
  }>,
  reply: PayloadReply
) => {
  if (!isPostExists(request.params.postId)) {
    reply.callNotFound()

    return
  }

  request.query['page[size]'] ||= 50
  request.query['page[index]'] ||= 0

  reply.send(
    await prisma.comment.findMany({
      where: {
        postId: request.params.postId,
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
