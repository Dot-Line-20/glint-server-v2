import { FastifyRequest, FastifyReply } from 'fastify'
import { Category, Media, Post, PostMedia, Prisma, User } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Body: {
      mediaIds: Media['id'][]
      categoryIds: Category['id'][]
    } & Pick<Post, 'content'>
  }>,
  reply: FastifyReply
) => {
  const mediaConditions: Prisma.PostMediaUncheckedCreateWithoutPostInput[] = []

  if (request.body.mediaIds.length !== 0) {
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

    for (let i = 0; i < medias.length; i++) {
      if (medias[i].userId !== request.userId) {
        reply.send(new HttpError(401, 'Unauthorized user'))

        return
      }

      if (medias[i].post !== null || medias[i].user_ !== null) {
        reply.send(new HttpError(409, 'Duplicated media usage'))

        return
      }

      mediaConditions.push({
        mediaId: request.body.mediaIds[i],
        index: i,
      })
    }
  }

  const categoryConditions: Prisma.PostCategoryUncheckedCreateWithoutPostInput[] =
    []

  if (request.body.categoryIds.length !== 0) {
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

    for (let i = 0; i < request.body.categoryIds.length; i++) {
      categoryConditions.push({
        categoryId: request.body.categoryIds[i],
      })
    }
  }

  reply.send(
    Object.assign(
      await prisma.post.create({
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
          categories: true,
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
        data: Object.assign(
          request.body,
          {
            mediaIds: undefined,
            categoryIds: undefined,
            userId: request.userId,
          },
          mediaConditions.length !== 0
            ? {
                medias: {
                  create: mediaConditions,
                },
              }
            : undefined,
          categoryConditions.length !== 0
            ? {
                categories: {
                  create: categoryConditions,
                },
              }
            : undefined
        ),
      }),
      {
        isLiked: false,
      }
    )
  )

  return
}
