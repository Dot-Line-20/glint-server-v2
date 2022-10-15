import { FastifyRequest, FastifyReply } from 'fastify'
import { Media, Post, PostMedia } from '@prisma/client'
import { isMediaExists, prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: {
      postId: Post['id']
    }
    Body: {
      mediaId: Media['id']
    }
  }>,
  reply: FastifyReply
) => {
  const post: {
    userId: Post['userId']
    medias: PostMedia[]
  } | null = await prisma.post.findFirst({
    select: {
      userId: true,
      medias: true,
    },
    where: {
      id: request.params.postId,
      userId: request.userId,
    },
  })

  if (post === null) {
    reply.callNotFound()

    return
  }

  if (post.userId !== request.userId) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  if (post.medias.length === 10) {
    reply.send(new HttpError(400, 'Too many medias'))

    return
  }

  for (let i = 0; i < post.medias.length; i++) {
    if (post.medias[i].mediaId === request.body.mediaId) {
      reply.send(new HttpError(400, 'Already added'))

      return
    }
  }

  if (!(await isMediaExists(request.body.mediaId, request.userId))) {
    reply.send(new HttpError(400, 'Invalid mediaId'))

    return
  }

  reply.send(
    await prisma.postMedia.create({
      data: Object.assign(request.body, request.params),
    })
  )

  return
}
