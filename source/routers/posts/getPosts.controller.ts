import { prisma } from '@library/prisma'
import { PageQuery } from '@library/type'
import { Media, Post, PostLike, PostMedia } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Querystring: Partial<PageQuery>
  }>,
  reply: FastifyReply
) => {
  request.query['page[size]'] ||= 50
  request.query['page[index]'] ||= 0

  const posts: ({
    medias: ({
      media: Media
    } & Pick<PostMedia, 'index'>)[]
    likes?: PostLike[]
    _count: {
      likes: number
    }
    isLiked?: boolean
  } & Omit<Post, 'isDeleted'>)[] = await prisma.post.findMany({
    select: {
      id: true,
      userId: true,
      content: true,
      createdAt: true,
      medias: {
        select: {
          index: true,
          media: true,
        },
        orderBy: {
          index: 'asc',
        },
      },
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
          comments: {
            where: {
              isDeleted: false,
            },
          },
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

  for (let i = 0; i < posts.length; i++) {
    Object.assign(posts[i], {
      likes: undefined,
      isLiked: (posts[i].likes as PostLike[]).length === 1,
    })
  }

  reply.send(posts)

  return
}
