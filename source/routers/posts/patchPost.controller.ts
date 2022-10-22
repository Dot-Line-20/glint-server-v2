import { FastifyRequest, FastifyReply } from 'fastify'
import { Media, Post, PostMedia, Prisma, PrismaPromise } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: Pick<Post, 'id'>
    Body: {
      mediaIds: number[]
    } & Pick<Post, 'title' | 'content'>
  }>,
  reply: FastifyReply
) => {
  const post:
    | ({
        medias: Pick<PostMedia, 'mediaId'>[]
      } & Pick<Post, 'userId'>)
    | null = await prisma.post.findUnique({
    select: {
      userId: true,
      medias: {
        select: {
          mediaId: true,
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
        medias: {
          media: Media
        }[]
        _count: {
          likes: number
        }
      } & Omit<Post, 'isDeleted'>)
  >[] = []

  if (
    Array.isArray(request.body.mediaIds) &&
    request.body.mediaIds.length !== 0
  ) {
    prismaPromises.push(
      prisma.postMedia.deleteMany({
        where: {
          postId: request.params.id,
        },
      })
    )

    const postMediaConditions: {
      postId: Post['id']
      mediaId: Media['id']
    }[] = []

    const currentMediaIds: Set<number> = new Set<number>()

    for (let i = 0; i < post.medias.length; i++) {
      currentMediaIds.add(post.medias[i].mediaId)
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
      if (!currentMediaIds.has(request.body.mediaIds[i])) {
        if (medias[i].userId !== request.userId) {
          reply.send(new HttpError(401, 'Unauthorized user'))

          return
        }

        if (medias[i]._count.posts !== 0 || medias[i]._count.user_ !== 0) {
          reply.send(new HttpError(400, 'Duplicated media usage'))

          return
        }
      }

      postMediaConditions.push({
        postId: request.params.id,
        mediaId: request.body.mediaIds[i],
      })
    }

    prismaPromises.push(
      prisma.postMedia.createMany({
        data: postMediaConditions,
      })
    )
  }

  prismaPromises.push(
    prisma.post.update({
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
      where: {
        id: request.params.id,
      },
      data: Object.assign(request.body, {
        mediaIds: undefined,
      }),
    })
  )

  reply.send(
    prismaPromises.length === 1
      ? await prismaPromises[0]
      : (await prisma.$transaction(prismaPromises))[2]
  )

  return
}
