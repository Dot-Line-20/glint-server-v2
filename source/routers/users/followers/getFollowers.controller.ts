import { isUserIdExists, prisma } from '@library/prisma'
import { PageQuery } from '@library/type'
import { User } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: {
      userId: User['id']
    }
    Querystring: Partial<Omit<PageQuery, 'page[order]'>>
  }>,
  reply: FastifyReply
) => {
  if (!(await isUserIdExists(request.params.userId))) {
    reply.callNotFound()

    return
  }

  request.query['page[size]'] ||= 50
  request.query['page[index]'] ||= 0

  reply.send(
    await prisma.userFollower.findMany({
      select: {
        userId: true,
        followingUser: {
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
      skip: request.query['page[size]'] * request.query['page[index]'],
      take: request.query['page[size]'],
    })
  )

  return
}
