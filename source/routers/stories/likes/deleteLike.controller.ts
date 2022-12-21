import { FastifyRequest, FastifyReply } from 'fastify'
import { Story, StoryLike, User } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: {
      storyId: Story['id']
      userId: User['id']
    }
  }>,
  reply: FastifyReply
) => {
  const story: {
    likes: Pick<StoryLike, 'userId'>[]
  } | null = await prisma.story.findUnique({
    select: {
      likes: {
        select: {
          userId: true,
        },
        where: {
          userId: request.userId,
        },
      },
    },
    where: {
      id: request.params.storyId,
    },
  })

  if (story === null) {
    reply.callNotFound()

    return
  }

  if (story.likes.length !== 1) {
    reply.send(new HttpError(400, 'Not liked'))

    return
  }

  await prisma.storyLike.delete({
    where: {
      storyId_userId: {
        storyId: request.params.storyId,
        userId: request.userId,
      },
    },
  })

  reply.send(null)

  return
}
