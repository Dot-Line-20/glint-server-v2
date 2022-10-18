import { FastifyRequest, FastifyReply } from 'fastify'
import { Media, PostMedia, User } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'
import { readFile, unlink, writeFile } from 'fs/promises'
import { join } from 'path/posix'
import { getMediaPath } from '@library/utility'

export default async (
  request: FastifyRequest<{
    Params: Pick<Media, 'id'>
  }>,
  reply: FastifyReply
) => {
  const media: Omit<Media, 'id'> | null = await prisma.media.findFirst({
    select: {
      name: true,
      type: true,
      userId: true,
      isImage: true
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

  if (media.userId !== request.userId) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

	const mediaPath: string = join(getMediaPath(media.isImage, media.name, media.type))

	try {
		await unlink(join(getMediaPath(media.isImage, media.name, media.type)))
	} catch(error: any) {
		reply.send(error)

		return
	}

	try {
		await prisma.media.delete({
			where: {
				id: request.params.id,
			},
		})
	} catch(error: any) {
		await writeFile(mediaPath, await readFile(mediaPath))

		reply.send(error)

		return
	}

  reply.send(null)

  return
}
