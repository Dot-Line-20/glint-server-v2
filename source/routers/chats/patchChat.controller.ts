import { FastifyRequest, FastifyReply } from 'fastify'
import { Chat, Prisma, PrismaPromise, User } from '@prisma/client'
import { isChatExists, prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: Pick<Chat, 'id'>
    Body: Partial<
      {
        userIds: User['id'][]
      } & Pick<Chat, 'name'>
    >
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

  const prismaPromises: PrismaPromise<
    | ({
        users: {
          user: Omit<User, 'password' | 'verificationKey'>
        }[]
      } & Chat)
    | Prisma.BatchPayload
  >[] = []

  if (Array.isArray(request.body.userIds)) {
    if (request.body.userIds.length === 0) {
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

    const userCreations: Prisma.ChatUserCreateManyInput[] = []

    for (let i = 0; i < request.body.userIds.length; i++) {
      userCreations.push({
        chatId: request.params.id,
        userId: request.body.userIds[i],
      })
    }

    prismaPromises.push(
      prisma.chatUser.deleteMany({
        where: {
          chatId: request.params.id,
        },
      }),
      prisma.chatUser.createMany({
        data: userCreations,
      })
    )
  }

  prismaPromises.push(
    prisma.chat.update({
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
                mediaId: true,
                createdAt: true,
              },
            },
          },
        },
      },
      data: request.body,
      where: request.params,
    })
  )

  reply.send(
    prismaPromises.length === 1
      ? await prismaPromises[0]
      : (await prisma.$transaction(prismaPromises))[2]
  )

  return
}
