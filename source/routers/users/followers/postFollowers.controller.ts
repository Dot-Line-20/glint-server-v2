import { FastifyRequest, FastifyReply } from 'fastify'
import { User, UserFollower } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: {
      userId: User['id']
    }
  }>,
  reply: FastifyReply
) => {
  if (request.params.userId === request.userId) {
    reply.send(new HttpError(400, 'Invalid userId'))

    return
  }

  const user: {
    followers: Pick<UserFollower, 'userId'>[]
  } | null = await prisma.user.findUnique({
    select: {
      followers: {
        select: {
          userId: true,
        },
        where: {
          followingUserId: request.userId,
        },
      },
    },
    where: {
      id: request.params.userId,
    },
  })

  if (user === null) {
    reply.callNotFound()

    return
  }

  if (user.followers.length !== 0) {
    reply.send(new HttpError(409, 'Duplicated following'))

    return
  }

  reply.send(
    await prisma.userFollower.create({
      data: {
        userId: request.params.userId,
        followingUserId: request.userId,
      },
    })
  )

  return
}
