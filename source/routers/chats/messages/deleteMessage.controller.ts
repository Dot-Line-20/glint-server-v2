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

  await prisma.message.delete({
    where: {
      id: request.params.id,
    },
  })

  reply.send(null)

  request.server.socketIO
    .in(String(request.params.chatId))
    .emit('message:delete', {
      status: 'success',
      data: {
        id: request.params.id,
      },
    })

  return
}
