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
        },
      },
    },
    where: request.params,
  })

  if (chat === null) {
    reply.callNotFound()

    return
  }

  let isChatUser = false

  for (let i = 0; i < chat.users.length; i++) {
    if (chat.users[i].user.id === request.userId) {
      isChatUser = true
    }
  }

  if (!isChatUser) {
    reply.send(new HttpError(401, 'Unauthorized user'))
  }

  if (chat.users.length !== 1) {
    reply.send(new HttpError(400, 'Too many user'))

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
