import { FastifyRequest, FastifyReply } from 'fastify'
import { Media } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'
import { unlink } from 'fs/promises'
import { join } from 'path/posix'
import { getMediaPath } from '@library/utility'

export default async (
  request: FastifyRequest<{
    Params: Pick<Media, 'id'>
  }>,
  reply: FastifyReply
) => {
  const media:
    | (Omit<Media, 'id'> & {
        _count: {
          posts: number
          user_: number
        }
      })
    | null = await prisma.media.findFirst({
    select: {
      name: true,
      type: true,
      userId: true,
      isImage: true,
      _count: {
        select: {
          posts: true,
          user_: true,
        },
      },
    },
    where: {
      id: request.params.id,
      userId: request.userId,
    },
  })

  if (media === null) {
    reply.callNotFound()

    return
  }

  if (media._count.posts !== 0 || media._count.user_ !== 0) {
    reply.send(new HttpError(400, 'Using media'))

    return
  }

  await prisma.media.delete({
    where: {
      id: request.params.id,
    },
  })

  await unlink(join(getMediaPath(media.isImage, media.name, media.type)))

  reply.send(null)

  return
}
