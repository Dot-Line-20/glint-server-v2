import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '@library/prisma'
import { MultipartFile } from '@fastify/multipart'
import HttpError from '@library/httpError'
import { randomBytes } from 'crypto'
import { writeFile } from 'fs/promises'
import { join } from 'path/posix'
import { TemporaryMedia } from '@library/type'
import { Media } from '@prisma/client'
import { getMediaPath } from '@library/utility'

const fileMagicNumber = {
  gif: Buffer.from([71, 73, 70, 56]),
  jpg: Buffer.from([255, 216, 255, 224]),
  png: Buffer.from([137, 80, 78, 71]),
  mp4: Buffer.from([102, 116, 121, 112, 105, 115, 111, 109]),
  mov: Buffer.from([109, 111, 111, 118]),
} as const

export default async (request: FastifyRequest, reply: FastifyReply) => {
  const files: AsyncIterableIterator<MultipartFile> = request.files()
  let currentFile: MultipartFile | undefined
  const temporaryMedias: TemporaryMedia[] = []

  while (typeof (currentFile = (await files.next()).value) === 'object') {
    const temporaryMedia: TemporaryMedia = {
      type: currentFile.filename.split('.').pop() as string,
      isImage: true,
      buffer: await currentFile.toBuffer(),
    }

    if (temporaryMedia.type === 'jpeg') {
      temporaryMedia.type = 'jpg'
    }

    switch (temporaryMedia.type) {
      case 'mp4':
      case 'mov': {
        temporaryMedia.isImage = false
      }
      /*eslint-disable */
      case 'jpg':
      case 'gif':
      case 'png': {
        if (
          (temporaryMedia.buffer as Buffer)
            .subarray(0, 12)
            .includes(fileMagicNumber[temporaryMedia.type])
        ) {
          break
        }
      }
      default: {
        reply.send(new HttpError(422, 'Invalid file type'))

        return
      }
      /*eslint-enable */
    }

    do {
      temporaryMedia.name = randomBytes(64).toString('hex')
    } while (
      (await prisma.media.findFirst({
        where: {
          name: temporaryMedia.name,
        },
      })) !== null
    )

    temporaryMedias.push(temporaryMedia)
  }

  if (temporaryMedias.length === 0) {
    reply.send(new HttpError(400, 'Empty media'))

    return
  }

  const result: object[] = []

  for (let i = 0; i < temporaryMedias.length; i++) {
    await writeFile(
      join(
        getMediaPath(
          temporaryMedias[i].isImage,
          temporaryMedias[i].name as string,
          temporaryMedias[i].type
        )
      ),
      temporaryMedias[i].buffer as Buffer
    )

    result.push(
      await prisma.media.create({
        data: {
          name: temporaryMedias[i].name as string,
          type: temporaryMedias[i].type,
          isImage: temporaryMedias[i].isImage,
          userId: request.userId,
        },
      })
    )
  }

  reply.send(result)

  return
}
