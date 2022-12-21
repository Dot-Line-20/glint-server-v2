import { prisma } from '@library/prisma'
import { PageQuery } from '@library/type'
import { Media, Story, StoryLike } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Querystring: Partial<PageQuery>
  }>,
  reply: FastifyReply
) => {
  request.query['page[size]'] ||= 50
  request.query['page[index]'] ||= 0

  const stories: ({
    media: Media
    likes?: StoryLike[]
    _count: {
      likes: number
    }
    isLiked?: boolean
  } & Omit<Story, 'mediaId' | 'isDeleted'>)[] = await prisma.story.findMany({
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
      isDeleted: false,
    },
    skip: request.query['page[size]'] * request.query['page[index]'],
    take: request.query['page[size]'],
    orderBy: {
      id: request.query['page[order]'] === 'asc' ? 'asc' : 'desc',
    },
  })

  for (let i = 0; i < stories.length; i++) {
    Object.assign(stories[i], {
      likes: undefined,
      isLiked: (stories[i].likes as StoryLike[]).length === 1,
    })
  }

  reply.send(stories)

  return
}
