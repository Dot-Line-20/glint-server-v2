import { FastifyRequest, FastifyReply } from 'fastify'
import { Media, Post } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Body: {
      mediaIds: number[]
    } & Pick<Post, 'title' | 'content'>
  }>,
  reply: FastifyReply
) => {
  const mediaConditions: {
    mediaId: Media['id']
  }[] = []

  if (
    Array.isArray(request.body.mediaIds) &&
    request.body.mediaIds.length !== 0
  ) {
    if (request.body.mediaIds.length > 10) {
      reply.send(new HttpError(400, 'Too many mediaIds'))

      return
    }

    const medias: ({
      _count: {
        posts: number
        user_: number
      }
    } & Pick<Media, 'userId'>)[] = await prisma.media.findMany({
      select: {
        userId: true,
        _count: {
          select: {
            posts: true,
            user_: true,
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

      if (medias[i]._count.posts !== 0 || medias[i]._count.user_ !== 0) {
        reply.send(new HttpError(409, 'Duplicated media usage'))

        return
      }

      mediaConditions.push({
        mediaId: request.body.mediaIds[i],
      })
    }
  }

  reply.send(
    await prisma.post.create({
      select: {
        id: true,
        userId: true,
        title: true,
        content: true,
        createdAt: true,
        medias: {
          select: {
            media: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      data: Object.assign(request.body, {
        mediaIds: undefined,
        userId: request.userId,
        medias: {
          create: mediaConditions,
        },
      }),
    })
  )

  return
}
