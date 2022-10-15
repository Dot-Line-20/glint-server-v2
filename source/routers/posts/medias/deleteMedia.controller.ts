import { FastifyRequest, FastifyReply } from 'fastify'
import { Media, Post, PostMedia } from '@prisma/client'
import { isMediaExists, prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: {
      postId: Post['id']
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

  let isPostMediaExists = false

  for (let i = 0; i < post.medias.length; i++) {
    if (post.medias[i].mediaId === request.params.mediaId) {
      isPostMediaExists = true

      break
    }
  }

  if (!isPostMediaExists) {
    reply.send(new HttpError(400, 'Not added'))

    return
  }

  if (!(await isMediaExists(request.params.mediaId, request.userId))) {
    reply.send(new HttpError(400, 'Invalid mediaId'))

    return
  }

  await prisma.postMedia.delete({
    where: {
      postId_mediaId: {
        postId: request.params.postId,
        mediaId: request.params.mediaId,
      },
    },
  })

  reply.send(null)

  return
}
