import { isPostExists, prisma } from '@library/prisma'
import { Media, Post, PostLike, PostMedia } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: Pick<Post, 'id'>
  }>,
  reply: FastifyReply
) => {
  if (!(await isPostExists(request.params.id))) {
    reply.callNotFound()

    return
  }

  const post:
    | ({
        medias: ({
          media: Media
        } & Pick<PostMedia, 'index'>)[]
        likes?: PostLike[]
        _count: {
          likes: number
        }
        isLiked?: boolean
      } & Omit<Post, 'isDeleted'>)
    | null = await prisma.post.findUnique({
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
          comments: true,
        },
      },
    },
    where: {
      id: request.params.id,
    },
  })

  Object.assign(post as NonNullable<typeof post>, {
    likes: undefined,
    isLiked:
      ((post as NonNullable<typeof post>).likes as PostLike[]).length === 1,
  })

  reply.send(post)

  return
}
