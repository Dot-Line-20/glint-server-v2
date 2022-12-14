import { FastifyRequest, FastifyReply } from 'fastify'
import { Media, PostMedia, Story, User } from '@prisma/client'
import { isUserEmailExists, isUserIdExists, prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: Pick<User, 'id'>
    Body: Partial<
      Pick<User, 'email' | 'password' | 'name' | 'birth' | 'mediaId'>
    >
  }>,
  reply: FastifyReply
) => {
  if (!(await isUserIdExists(request.params.id))) {
    reply.callNotFound()

    return
  }

  if (request.params.id !== request.userId) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  if (
    typeof request.body.email === 'string' &&
    (await isUserEmailExists(request.body.email))
  ) {
    reply.send(new HttpError(409, 'Duplicated email'))

    return
  }

  if (typeof request.body.mediaId === 'number') {
    const media:
      | ({
          post: Pick<PostMedia, 'postId'> | null
          story: Pick<Story, 'id'> | null
        } & Pick<Media, 'userId' | 'isImage'>)
      | null = await prisma.media.findUnique({
      select: {
        userId: true,
        isImage: true,
        post: {
          select: {
            postId: true,
          },
        },
        story: {
          select: {
            id: true,
          },
        },
      },
      where: {
        id: request.body.mediaId,
      },
    })

    if (media === null) {
      reply.send(new HttpError(400, 'Invalid mediaId'))

      return
    }

    if (!media.isImage) {
      reply.send(new HttpError(415, 'Invalid media type'))

      return
    }

    if (media.userId !== request.userId) {
      reply.send(new HttpError(401, 'Unauthorized user'))

      return
    }

    if (media.post !== null || media.story !== null) {
      reply.send(new HttpError(409, 'Duplicated media usage'))

      return
    }
  }

  reply.send(
    await prisma.user.update({
      select: {
        id: true,
        email: true,
        name: true,
        birth: true,
        media: true,
        createdAt: true,
      },
      data: request.body,
      where: request.params,
    })
  )

  return
}
