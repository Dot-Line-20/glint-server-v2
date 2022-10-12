import { FastifyRequest, PayloadReply } from 'fastify'
import { Comment, Post } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: {
      postId: Post['id']
    } & Pick<Comment, 'id'>
  }>,
  reply: PayloadReply
) => {
	const comment: Pick<Post, 'userId'> | null = await prisma.comment.findFirst({
		select: {
			userId: true
		},
		where: {
			postId: request.params.postId,
			id: request.params.id
		}
	})

  if (comment === null) {
    reply.callNotFound()

    return
  }

  if (comment.userId !== request.user.id) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  await prisma.comment.update({
    data: {
      isDeleted: true,
    },
    where: {
      id: request.params.id,
    },
  })

  reply.send(null)

  return
}
