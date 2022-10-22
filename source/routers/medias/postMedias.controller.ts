import { MultipartFile } from '@fastify/multipart'
import HttpError from '@library/httpError'
import { prisma } from '@library/prisma'
import { getMediaPath, isCorrectFileType } from '@library/utility'
import { Media } from '@prisma/client'
import { randomBytes } from 'crypto'
import { FastifyReply, FastifyRequest } from 'fastify'
import { unlink, writeFile } from 'fs/promises'

export default async (request: FastifyRequest, reply: FastifyReply) => {
  const resultFile: IteratorResult<MultipartFile, any> = await request
    .files()
    .next()

  if (resultFile.done !== true) {
    reply.send(new HttpError(400, 'Too many medias'))

    return
  }

  const mediaBuffer: Buffer = await resultFile.value.toBuffer()
  const media: Omit<Media, 'id' | 'createdAt'> = {
    name: randomBytes(64).toString('hex'),
    type: resultFile.value.filename.split('.').pop() as string,
    isImage: true,
    userId: request.userId,
  }

  if (media.type === 'jpeg') {
    media.type = 'jpg'
  }

  switch (media.type) {
    /*eslint-disable */
    case 'mp4':
    case 'mov': {
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
      reply.send(new HttpError(422, 'Invalid media type'))

      return
    }
    /*eslint-enable */
  }

  if (media.isImage && mediaBuffer.byteLength > 5242880 /* 5mb */) {
    reply.send(new HttpError(413, ''))

    return
  }

  while (
    (await prisma.media.count({
      where: {
        name: media.name,
      },
    })) !== 0
  ) {
    media.name = randomBytes(64).toString('hex')
  }

  const mediaPath: string = getMediaPath(media)

  await writeFile(mediaPath, mediaBuffer)

  try {
    reply.send(
      await prisma.media.create({
        data: media,
      })
    )
  } catch (error: any) {
    await unlink(mediaPath)

    reply.send(error)
  }

  return
}
