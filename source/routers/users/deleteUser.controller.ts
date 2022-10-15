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
    medias: Omit<Media, 'id' | 'userId'>[]
    media: Omit<Media, 'id' | 'userId'> | null
  } | null = await prisma.user.findUnique({
    select: {
      medias: {
        select: {
          name: true,
          type: true,
          isImage: true,
        },
      },
      media: {
        select: {
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

  for (let i = 0; i < user.medias.length; i++) {
    await unlink(
      getMediaPath(
        user.medias[i].isImage,
        user.medias[i].name,
        user.medias[i].type
      )
    )
  }

  await prisma.user.delete({
    where: request.params,
  })

  reply.send(null)

  return
}
