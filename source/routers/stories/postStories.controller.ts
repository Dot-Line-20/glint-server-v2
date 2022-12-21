import { FastifyRequest, FastifyReply } from 'fastify'
import { Category, Media, PostMedia, Prisma, Story, User } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Body: {
      mediaId: Media['id']
      categoryIds: Category['id'][]
    } & Pick<Story, 'title'>
  }>,
  reply: FastifyReply
) => {
  const media:
    | ({
        user_: Pick<User, 'id'> | null
        post: Pick<PostMedia, 'postId'> | null
        story: Pick<Story, 'id'> | null
      } & Pick<Media, 'userId'>)
    | null = await prisma.media.findUnique({
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
      story: {
        select: {
          id: true,
        },
      },
    },
    where: {
      id: request.body.mediaId,
    },
  })

  if (media === null) {
    reply.send(new HttpError(400, 'Invalid mediaId'))

    return
  }

  if (media.post !== null || media.user_ !== null || media.story !== null) {
    reply.send(new HttpError(409, 'Duplicated media usage'))

    return
  }

  const categoryConditions: Prisma.StoryCategoryUncheckedCreateWithoutStoryInput[] =
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
      await prisma.story.create({
        select: {
          id: true,
          userId: true,
          title: true,
          createdAt: true,
          media: true,
          categories: true,
          _count: {
            select: {
              likes: true,
            },
          },
        },
        data: Object.assign(
          request.body,
          {
            categoryIds: undefined,
            userId: request.userId,
          },
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
