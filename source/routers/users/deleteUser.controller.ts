import HttpError from '@library/httpError'
import { prisma } from '@library/prisma'
import { getMediaPath } from '@library/utility'
import { Media, User } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'
import { unlink } from 'fs/promises'

export default async (
  request: FastifyRequest<{
    Params: Pick<User, 'id'>
  }>,
  reply: FastifyReply
) => {
  const user: {
    medias: Omit<Media, 'userId' | 'createdAt'>[]
    media: Omit<Media, 'userId' | 'createdAt'> | null
  } | null = await prisma.user.findUnique({
    select: {
      medias: {
        select: {
          id: true,
          name: true,
          type: true,
          isImage: true,
        },
      },
      media: {
        select: {
          id: true,
          name: true,
          type: true,
          isImage: true,
        },
      },
    },
    where: {
      id: request.params.id,
    },
  })

  if (user === null) {
    reply.callNotFound()

    return
  }

  if (request.params.id !== request.userId) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  if (user.media !== null) {
    user.medias.push(user.media)
  }

  const mediaIds: number[] = []

  for (let i = 0; i < user.medias.length; i++) {
    await unlink(getMediaPath(user.medias[i]))

    mediaIds.push(user.medias[i].id)
  }

  await prisma.$transaction([
    prisma.media.deleteMany({
      where: {
        id: {
          in: mediaIds,
        },
      },
    }),
    prisma.user.delete({
      where: request.params,
    }),
  ])

  reply.send(null)

  return
}
