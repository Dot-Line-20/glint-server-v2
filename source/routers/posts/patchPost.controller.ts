import { FastifyRequest, FastifyReply } from 'fastify'
import {
  Category,
  Media,
  Post,
  PostLike,
  PostMedia,
  Prisma,
  PrismaPromise,
  User,
} from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: Pick<Post, 'id'>
    Body: Partial<
      {
        mediaIds: Media['id'][]
        categoryIds: Category['id'][]
      } & Pick<Post, 'content'>
    >
  }>,
  reply: FastifyReply
) => {
  const post:
    | ({
        medias: Pick<PostMedia, 'mediaId'>[]
        likes: PostLike[]
      } & Pick<Post, 'userId'>)
    | null = await prisma.post.findUnique({
    select: {
      userId: true,
      medias: {
        select: {
          mediaId: true,
        },
      },
      likes: {
        where: {
          userId: request.userId,
        },
      },
    },
    where: {
      id: request.params.id,
    },
  })

  if (post === null) {
    reply.callNotFound()

    return
  }

  if (post.userId !== request.userId) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  const prismaPromises: PrismaPromise<
    | Prisma.BatchPayload
    | PostMedia
    | ({
        medias: ({
          media: Media
        } & Pick<PostMedia, 'index'>)[]
        _count: {
          likes: number
        }
      } & Omit<Post, 'isDeleted'>)
  >[] = []

  if (Array.isArray(request.body.mediaIds)) {
    if (request.body.mediaIds.length > 10) {
      reply.send(new HttpError(400, 'Too many mediaIds'))

      return
    }

    const medias: ({
      user_: Pick<User, 'id'> | null
      post: Pick<PostMedia, 'postId'> | null
    } & Pick<Media, 'userId'>)[] = await prisma.media.findMany({
      select: {
        userId: true,
        user_: {
          select: {
            id: true,
          },
        },
        post: {
          select: {
            postId: true,
          },
        },
      },
      where: {
        id: {
          in: request.body.mediaIds,
        },
      },
    })

    if (medias.length !== request.body.mediaIds.length) {
      reply.send(new HttpError(400, 'Invalid mediaIds'))

      return
    }

    const postMediaConditions: Prisma.PostMediaCreateManyInput[] = []

    const currentMediaIds: Set<number> = new Set<number>()

    for (let i = 0; i < post.medias.length; i++) {
      currentMediaIds.add(post.medias[i].mediaId)
    }

    for (let i = 0; i < medias.length; i++) {
      if (!currentMediaIds.has(request.body.mediaIds[i])) {
        if (medias[i].userId !== request.userId) {
          reply.send(new HttpError(401, 'Unauthorized user'))

          return
        }

        if (medias[i].post !== null || medias[i].user_ !== null) {
          reply.send(new HttpError(409, 'Duplicated media usage'))

          return
        }
      }

      prismaPromises.push(
        prisma.postMedia.deleteMany({
          where: {
            postId: request.params.id,
          },
        })
      )

      postMediaConditions.push({
        postId: request.params.id,
        mediaId: request.body.mediaIds[i],
        index: i,
      })
    }

    if (postMediaConditions.length !== 0) {
      prismaPromises.push(
        prisma.postMedia.createMany({
          data: postMediaConditions,
        })
      )
    }
  }

  if (Array.isArray(request.body.categoryIds)) {
    if (
      (await prisma.category.count({
        where: {
          id: {
            in: request.body.categoryIds,
          },
        },
      })) !== request.body.categoryIds.length
    ) {
      reply.send(new HttpError(400, 'Invalid categoryIds'))

      return
    }

    prismaPromises.push(
      prisma.postCategory.deleteMany({
        where: {
          postId: request.params.id,
        },
      })
    )

    const postCategoryConditions: Prisma.PostCategoryCreateManyInput[] = []

    for (let i = 0; i < request.body.categoryIds.length; i++) {
      postCategoryConditions.push({
        postId: request.params.id,
        categoryId: request.body.categoryIds[i],
      })
    }

    if (postCategoryConditions.length !== 0) {
      prismaPromises.push(
        prisma.postCategory.createMany({
          data: postCategoryConditions,
        })
      )
    }
  }

  prismaPromises.push(
    prisma.post.update({
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
        id: request.params.id,
      },
      data: Object.assign(request.body, {
        mediaIds: undefined,
        categoryIds: undefined,
      }),
    })
  )

  reply.send(
    Object.assign(
      prismaPromises.length === 1
        ? await prismaPromises[0]
        : (await prisma.$transaction(prismaPromises))[
            prismaPromises.length - 1
          ],
      {
        isLiked: post.likes.length === 1,
      }
    )
  )

  return
}
