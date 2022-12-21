import { FastifyRequest, FastifyReply } from 'fastify'
import { Story, StoryLike } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: {
      storyId: Story['id']
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

  if (story.likes.length !== 0) {
    reply.send(new HttpError(409, 'Duplicated like'))

    return
  }

  reply.send(
    await prisma.storyLike.create({
      data: {
        storyId: request.params.storyId,
        userId: request.userId,
      },
    })
  )

  return
}
