import { MultipartFile } from '@fastify/multipart'
import HttpError from '@library/httpError'
import { prisma } from '@library/prisma'
import { getMediaPath } from '@library/utility'
import { Media, Post, User } from '@prisma/client'
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

  const media: Omit<Media, 'id'> & Partial<Pick<Media, 'id'>> = {
    id: undefined,
    name: randomBytes(64).toString('hex'),
    type: multipartFile.filename.split('.').pop() as string,
    userId: request.userId,
    isImage: true,
  }

  const mediaBuffer: Buffer = await multipartFile.toBuffer()

  switch (media.type) {
    case 'mp4':
    case 'mov': {
      media.isImage = false
    }
    /*eslint-disable */
    case 'jpeg': {
      media.type = 'jpg'
    }
    case 'jpg':
    case 'gif':
    case 'png': {
      if (
        mediaBuffer
          .subarray(0, 12)
          .includes(fileMagicNumber[media.type as keyof typeof fileMagicNumber])
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

  while (
    (await prisma.media.findFirst({
      where: {
        name: media.name,
      },
    })) !== null
  ) {
    media.name = randomBytes(64).toString('hex')
  }

  if (media.isImage && mediaBuffer.byteLength > 1048576 /* 1mb */) {
    reply.send(new HttpError(413, ''))

    return
  }

  if (isUserMedia) {
    if (targetId !== request.userId) {
      reply.send(new HttpError(401, 'Unauthorized user'))

      return
    }

    if (!media.isImage) {
      reply.send(new HttpError(400, 'Invalid media type'))

      return
    }

    const user: Pick<User, 'mediaId'> | null = await prisma.user.findUnique({
      select: {
        mediaId: true,
      },
      where: {
        id: targetId,
      },
    })

    if (user === null) {
      reply.send(new HttpError(400, 'Invalid user id'))

      return
    }

    if (user.mediaId !== null) {
      console.log(
        await request.server.inject({
          method: 'DELETE',
          url: '/medias/' + user.mediaId,
          headers: request.headers,
        })
      )
    }
  } else {
    const post:
      | ({
          _count: {
            medias: number
          }
        } & Pick<Post, 'userId'>)
      | null = await prisma.post.findUnique({
      select: {
        userId: true,
        _count: {
          select: {
            medias: true,
          },
        },
      },
      where: {
        id: targetId,
      },
    })

    if (post === null) {
      reply.send(new HttpError(400, 'Invalid post id'))

      return
    }

    if (post.userId !== request.userId) {
      reply.send(new HttpError(401, 'Unauthorized user'))

      return
    }

    if (post._count.medias > 9) {
      reply.send(new HttpError(400, 'Too many medias'))

      return
    }
  }

  media.id = (
    isUserMedia
      ? (await prisma.media.create({
				select: {
					id: true,
				},
				data: {
					name: media.name,
					type: media.type,
					isImage: media.isImage,
					user: {
						connect: {
							id: request.userId,
						},
					},
					user_: {
						connect: {
							id: targetId
						}
					}
				}
			}))
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
                create: {
                  name: media.name,
                  type: media.type,
                  isImage: media.isImage,
                  user: {
                    connect: {
                      id: request.userId,
                    },
                  },
                },
              },
            },
          })
        ).media
  ).id

  try {
    await writeFile(
      getMediaPath(media.isImage, media.name, media.type),
      mediaBuffer
    )

    reply.send(media)
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
