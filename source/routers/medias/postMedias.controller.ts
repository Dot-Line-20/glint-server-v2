import { MultipartFile } from '@fastify/multipart'
import HttpError from '@library/httpError'
import { prisma, isUserIdExists } from '@library/prisma'
import { getMediaPath } from '@library/utility'
import { Media } from '@prisma/client'
import { randomBytes } from 'crypto'
import { FastifyReply, FastifyRequest } from 'fastify'
import { writeFile } from 'fs/promises'

const fileMagicNumber = {
  gif: Buffer.from([0x47, 0x49, 0x46, 0x38]),
  jpg: Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
  png: Buffer.from([0x89, 0x50, 0x4e, 0x47]),
  mp4: Buffer.from([0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d]),
  mov: Buffer.from([0x66, 0x74, 0x79, 0x70]),
} as const

export default async (request: FastifyRequest, reply: FastifyReply) => {
  const multipartFile: MultipartFile | undefined = await request.file()

  if (typeof multipartFile !== 'object') {
    reply.send(new HttpError(400, 'Lack of media'))

    return
  }

  let isUserMedia = false
  let targetId: number

  switch (multipartFile.fieldname.slice(0, 7)) {
    case 'userId:': {
      isUserMedia = true
    }
    /* eslint-disable */
    case 'postId:': {
      const slicedFilename: string = multipartFile.fieldname.slice(7)

      if (/^[1-9][0-9]*$/.test(slicedFilename)) {
        targetId = Number.parseInt(slicedFilename, 10)

        break
      }
    }
    default: {
      reply.send(new HttpError(400, 'Invalid field name'))

      return
    }
    /* eslint-enable */
  }

  const media: {
    buffer: Buffer
  } & Omit<Media, 'id'> &
    Partial<Pick<Media, 'id'>> = {
    name: randomBytes(64).toString('hex'),
    type: multipartFile.filename.split('.').pop() as string,
    userId: request.userId,
    isImage: true,
    buffer: await multipartFile.toBuffer(),
  }

  switch (media.type) {
    case 'mp4':
    case 'mov': {
      media.isImage = false
    }
    /*eslint-disable */
    case 'jpg':
    case 'gif':
    case 'png': {
      if (media.buffer.subarray(0, 12).includes(fileMagicNumber[media.type])) {
        break
      }
    }
    default: {
      reply.send(new HttpError(422, 'Invalid file type'))

      return
    }
    /*eslint-enable */
  }

  while (
    (await prisma.media.findFirst({
      where: {
        name: media.name,
      },
    })) !== null
  ) {
    media.name = randomBytes(64).toString('hex')
  }

  if (media.isImage && media.buffer.byteLength > 1048576 /* 1mb */) {
    reply.send(new HttpError(413, ''))

    return
  }

  if (isUserMedia && !(await isUserIdExists(targetId))) {
    reply.send(new HttpError(400, 'Invalid user id'))

    return
  }

  media.id = (
    isUserMedia
      ? ((
          await prisma.user.update({
            select: {
              media: {
                select: {
                  id: true,
                },
              },
            },
            data: {
              media: {
                create: Object.assign(
                  {
                    user: {
                      connect: {
                        id: request.userId,
                      },
                    },
                  },
                  media,
                  {
                    buffer: undefined,
                  }
                ),
              },
            },
            where: {
              id: targetId,
            },
          })
        ).media as Pick<Media, 'id'>)
      : (
          await prisma.postMedia.create({
            select: {
              media: {
                select: {
                  id: true,
                },
              },
            },
            data: {
              post: {
                connect: {
                  id: targetId,
                },
              },
              media: {
                create: Object.assign(
                  {
                    user: {
                      connect: {
                        id: request.userId,
                      },
                    },
                  },
                  media,
                  {
                    buffer: undefined,
                  }
                ),
              },
            },
          })
        ).media
  ).id

  try {
    await writeFile(
      getMediaPath(media.isImage, media.name, media.type),
      media.buffer as Buffer
    )

    reply.send(
      Object.assign(media, {
        buffer: undefined,
      })
    )
  } catch (error: any) {
    await prisma.media.delete({
      where: {
        id: media.id,
      },
    })

    reply.send(error)
  }

  return
}
