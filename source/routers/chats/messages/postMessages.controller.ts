import HttpError from '@library/httpError'
import { prisma } from '@library/prisma'
import { Chat, ChatUser, Message } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: {
      chatId: Chat['id']
    }
    Body: Pick<Message, 'content'>
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

  const message: Message = await prisma.message.create({
    data: Object.assign(request.body, {
      chat: {
        connect: {
          id: request.params.chatId,
        },
      },
      user: {
        connect: {
          id: request.userId,
        },
      },
    }),
  })

  reply.send(message)

  request.server.socketIO
    .in(String(request.params.chatId))
    .emit('message:create', {
      status: 'success',
      data: Object.assign(message, {
        chatId: undefined,
      }),
    })

  return
}
