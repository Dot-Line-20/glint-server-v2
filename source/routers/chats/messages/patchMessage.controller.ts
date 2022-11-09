import HttpError from '@library/httpError'
import { prisma } from '@library/prisma'
import { Chat, Message } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: {
      chatId: Chat['id']
      id: Message['id']
    }
    Body: Pick<Message, 'content'>
  }>,
  reply: FastifyReply
) => {
  const message: Pick<Message, 'userId'> | null =
    await prisma.message.findFirst({
      select: {
        userId: true,
      },
      where: request.params,
    })

  if (message === null) {
    reply.callNotFound()

    return
  }

  if (message.userId !== request.userId) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  reply.send(
    await prisma.message.update({
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
      data: request.body,
      where: {
        id: request.params.id,
      },
    })
  )

  request.server.socketIO
    .to(String(request.params.chatId))
    .emit('message:update', {
      status: 'success',
      data: {
        id: request.params.id,
        content: request.body.content,
      },
    })

  return
}
