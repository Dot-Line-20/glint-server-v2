import { FastifyRequest, FastifyReply } from 'fastify'
import {
  Category,
  Media,
  Post,
  PostLike,
  PostMedia,
  Prisma,
  PrismaPromise,
  Story,
  StoryLike,
  User,
} from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: Pick<Story, 'id'>
    Body: Partial<
      {
        categoryIds: Category['id'][]
      } & Pick<Story, 'title'>
    >
  }>,
  reply: FastifyReply
) => {
  const story:
    | ({
        likes: StoryLike[]
      } & Pick<Post, 'userId'>)
    | null = await prisma.story.findUnique({
    select: {
      userId: true,
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

  if (story === null) {
    reply.callNotFound()

    return
  }

  if (story.userId !== request.userId) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  const prismaPromises: PrismaPromise<
    | Prisma.BatchPayload
    | ({
        media: Media
        _count: {
          likes: number
        }
      } & Omit<Story, 'mediaId' | 'isDeleted'>)
  >[] = []

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
      prisma.storyCategory.deleteMany({
        where: {
          storyId: request.params.id,
        },
      })
    )

    const categoryConditions: Prisma.StoryCategoryCreateManyInput[] = []

    for (let i = 0; i < request.body.categoryIds.length; i++) {
      categoryConditions.push({
        storyId: request.params.id,
        categoryId: request.body.categoryIds[i],
      })
    }

    if (categoryConditions.length !== 0) {
      prismaPromises.push(
        prisma.storyCategory.createMany({
          data: categoryConditions,
        })
      )
    }
  }

  prismaPromises.push(
    prisma.story.update({
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
        _count: {
          select: {
            likes: true,
          },
        },
      },
      where: {
        id: request.params.id,
      },
      data: Object.assign(request.body, {
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
        isLiked: story.likes.length === 1,
      }
    )
  )

  return
}
