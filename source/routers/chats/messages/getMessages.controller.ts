import HttpError from '@library/httpError'
import { prisma } from '@library/prisma'
import { PageQuery } from '@library/type'
import { Chat, ChatUser } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: {
      chatId: Chat['id']
    }
    Querystring: Partial<PageQuery>
  }>,
  reply: FastifyReply
) => {
  const chat: {
    users: Pick<ChatUser, 'userId'>[]
  } | null = await prisma.chat.findUnique({
    select: {
      users: {
        select: {
          userId: true,
        },
        where: {
          userId: request.userId,
        },
      },
    },
    where: {
      id: request.params.chatId,
    },
  })

  if (chat === null) {
    reply.callNotFound()

    return
  }

  if (chat.users.length !== 1) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  request.query['page[size]'] ||= 50
  request.query['page[index]'] ||= 0

  reply.send(
    await prisma.message.findMany({
      select: {
        id: true,
        content: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            birth: true,
            mediaId: true,
            createdAt: true,
          },
        },
      },
      where: request.params,
      skip: request.query['page[size]'] * request.query['page[index]'],
      take: request.query['page[size]'],
      orderBy: {
        id: request.query['page[order]'] === 'asc' ? 'asc' : 'desc',
      },
    })
  )

  return
}
