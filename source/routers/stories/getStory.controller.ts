import { isStoryExists, prisma } from '@library/prisma'
import { Media, Story, StoryLike } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: Pick<Story, 'id'>
  }>,
  reply: FastifyReply
) => {
  if (!(await isStoryExists(request.params.id))) {
    reply.callNotFound()

    return
  }

  const story:
    | ({
        media: Media
        likes?: StoryLike[]
        _count: {
          likes: number
        }
        isLiked?: boolean
      } & Omit<Story, 'mediaId' | 'isDeleted'>)
    | null = await prisma.story.findUnique({
    select: {
      id: true,
      userId: true,
      title: true,
      createdAt: true,
      media: true,
      categories: {
        select: {
          category: true,
        },
      },
      likes: {
        where: {
          userId: request.userId,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
    where: {
      id: request.params.id,
    },
  })

  Object.assign(story as NonNullable<typeof story>, {
    likes: undefined,
    isLiked:
      ((story as NonNullable<typeof story>).likes as StoryLike[]).length === 1,
  })

  reply.send(story)

  return
}
