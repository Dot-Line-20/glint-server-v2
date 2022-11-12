import { FastifyRequest, FastifyReply } from 'fastify'
import { Chat, Prisma, User } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Body: {
      userIds: User['id'][]
    } & Pick<Chat, 'name'>
  }>,
  reply: FastifyReply
) => {
  if (
    (await prisma.user.count({
      where: {
        id: {
          in: request.body.userIds,
        },
      },
    })) !== request.body.userIds.length
  ) {
    reply.send(new HttpError(400, 'Invalid userIds'))

    return
  }

  const userCreations: Prisma.ChatUserCreateManyChatInput[] = []

  for (let i = 0; i < request.body.userIds.length; i++) {
    userCreations.push({
      userId: request.body.userIds[i],
    })
  }

  reply.send(
    await prisma.chat.create({
      select: {
        id: true,
        name: true,
        users: {
          select: {
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
        },
        createdAt: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
      data: Object.assign(request.body, {
        userIds: undefined,
        users: {
          createMany: {
            data: userCreations,
          },
        },
      }),
    })
  )

  return
}
