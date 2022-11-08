import HttpError from '@library/httpError'
import { prisma } from '@library/prisma'
import { Chat, User } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: Pick<Chat, 'id'>
  }>,
  reply: FastifyReply
) => {
  const chat: {
    users: {
      user: Pick<User, 'id'>
    }[]
  } | null = await prisma.chat.findUnique({
    select: {
      users: {
        select: {
          user: {
            select: {
              id: true,
            },
          },
        },
        where: {
          chatId: request.params.id,
          userId: request.userId,
        },
      },
    },
    where: request.params,
  })

  if (chat === null) {
    reply.callNotFound()

    return
  }

  if (chat.users.length !== 1) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  await prisma.chat.delete({
    where: request.params,
  })

  reply.send(null)

  request.server.socketIO.in(String(request.params.id)).emit('chat:leave', {
    status: 'success',
    data: null,
  })

  request.server.socketIO
    .in(String(request.params.id))
    .socketsLeave(String(request.params.id))

  return
}
