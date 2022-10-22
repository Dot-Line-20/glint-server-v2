import { FastifyRequest, FastifyReply } from 'fastify'
import { Media } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'
import { readFile, unlink, writeFile } from 'fs/promises'
import { getMediaPath } from '@library/utility'

export default async (
  request: FastifyRequest<{
    Params: Pick<Media, 'id'>
    Body: {
      mediaIds: number[]
    }
  }>,
  reply: FastifyReply
) => {
  if (request.body.mediaIds.length === 0) {
    reply.send(new HttpError(400, 'Lack of mediaIds'))

    return
  }

  const medias: Omit<Media, 'id' | 'createdAt'>[] = await prisma.media.findMany(
    {
      select: {
        name: true,
        type: true,
        userId: true,
        isImage: true,
      },
      where: {
        id: {
          in: request.body.mediaIds,
        },
      },
    }
  )

  if (medias.length !== request.body.mediaIds.length) {
    reply.send(new HttpError(400, 'Invalid mediaIds'))

    return
  }

  const mediaBuffers: Buffer[] = []
  const mediaPaths: string[] = []

  for (let i = 0; i < medias.length; i++) {
    if (medias[i].userId !== request.userId) {
      reply.send(new HttpError(401, 'Unauthorized user'))

      return
    }

    mediaPaths.push(getMediaPath(medias[i]))
    mediaBuffers.push(await readFile(mediaPaths[i]))
  }

  let index = 0

  try {
    for (; index < medias.length; index++) {
      await unlink(mediaPaths[index])
    }
  } catch (error: any) {
    index++

    while (index--) {
      await writeFile(mediaPaths[index - 1], mediaBuffers[index - 1])
    }

    reply.send(error)

    return
  }

  try {
    await prisma.media.deleteMany({
      where: {
        id: {
          in: request.body.mediaIds,
        },
      },
    })
  } catch (error: any) {
    for (let i = 0; i < medias.length; i++) {
      await writeFile(mediaPaths[i], mediaBuffers[i])
    }

    reply.send(error)

    return
  }

  reply.send(null)

  return
}
