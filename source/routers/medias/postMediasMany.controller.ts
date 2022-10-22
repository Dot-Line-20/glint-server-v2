import { MultipartFile } from '@fastify/multipart'
import HttpError from '@library/httpError'
import { prisma } from '@library/prisma'
import { getMediaPath, isCorrectFileType } from '@library/utility'
import { Media, PrismaPromise } from '@prisma/client'
import { randomBytes } from 'crypto'
import { FastifyReply, FastifyRequest } from 'fastify'
import { unlink, writeFile } from 'fs/promises'

export default async (request: FastifyRequest, reply: FastifyReply) => {
  const files: AsyncIterableIterator<MultipartFile> = request.files({
    limits: {
      files: 10,
    },
  })
  let file: MultipartFile | undefined = (await files.next()).value

  if (typeof file === 'undefined') {
    reply.send(new HttpError(400, 'Lack of medias'))

    return
  }

  const mediaBuffers: Buffer[] = []
  const mediaQueryPromises: PrismaPromise<Media>[] = []
  const mediaNames: Set<string> = new Set<string>()

  while (typeof file === 'object') {
    const mediaBuffer: Buffer = await file.toBuffer()
    const media: Omit<Media, 'id' | 'createdAt'> = {
      name: randomBytes(64).toString('hex'),
      type: file.filename.split('.').pop() as string,
      isImage: true,
      userId: request.userId,
    }

    if (media.type === 'jpeg') {
      media.type = 'jpg'
    }

    switch (media.type) {
      /*eslint-disable */
      case 'mov':
      case 'mp4': {
        media.isImage = false
      }
      case 'jpg':
      case 'gif':
      case 'png': {
        if (isCorrectFileType(media.type, mediaBuffer.subarray(0, 12))) {
          break
        }
      }
      default: {
        reply.send(new HttpError(415, 'Invalid media type'))

        return
      }
      /*eslint-enable */
    }

    if (media.isImage && mediaBuffer.byteLength > 5242880 /* 5mb */) {
      reply.send(new HttpError(413, ''))

      return
    }

    while (
      mediaNames.has(media.name) ||
      (await prisma.media.count({
        where: {
          name: media.name,
        },
      })) !== 0
    ) {
      media.name = randomBytes(64).toString('hex')
    }

    mediaNames.add(media.name)

    mediaBuffers.push(mediaBuffer)

    mediaQueryPromises.push(
      prisma.media.create({
        data: media,
      })
    )

    file = (await files.next()).value
  }

  const medias: Media[] = await prisma.$transaction(mediaQueryPromises)

  let index = 0

  try {
    for (; index < medias.length; index++) {
      await writeFile(getMediaPath(medias[index]), mediaBuffers[index])
    }
  } catch (error: any) {
    index++

    while (index--) {
      await unlink(getMediaPath(medias[index - 1]))
    }

    reply.send(error)

    return
  }

  reply.send(medias)

  return
}
