import { FastifyRequest, FastifyReply } from 'fastify'
import { User, UserFollower } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: {
      userId: User['id']
      id: User['id']
    }
  }>,
  reply: FastifyReply
) => {
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

  if (user.followers.length !== 1) {
    reply.send(new HttpError(400, 'Not followed'))

    return
  }

  await prisma.userFollower.delete({
    where: {
      userId_followingUserId: {
        userId: request.params.userId,
        followingUserId: request.userId,
      },
    },
  })

  reply.send(null)

  return
}
