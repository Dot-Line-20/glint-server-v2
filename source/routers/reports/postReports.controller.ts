import { FastifyRequest, FastifyReply } from 'fastify'
import { Comment, Post, Prisma, Report, User } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Body: Partial<{
      commentId: Comment['id']
      postId: Post['id']
      userId: User['id']
    }> &
      Pick<Report, 'content'>
  }>,
  reply: FastifyReply
) => {
  let isIdDefined = false
  const reportCreation: Prisma.ReportCreateArgs['data'] = {
    content: request.body.content,
    userId: request.userId,
  }

  if (typeof request.body.commentId === 'number') {
    isIdDefined = true

    reportCreation.comment = {
      create: {
        commentId: request.body.commentId,
      },
    }
  }

  if (typeof request.body.postId === 'number') {
    if (isIdDefined) {
      reply.send(new HttpError(400, 'Duplicated id'))

      return
    }

    isIdDefined = true

    reportCreation.post = {
      create: {
        postId: request.body.postId,
      },
    }
  }

  if (typeof request.body.userId === 'number') {
    if (isIdDefined) {
      reply.send(new HttpError(400, 'Duplicated id'))

      return
    }

    isIdDefined = true

    reportCreation.user_ = {
      create: {
        userId: request.body.userId,
      },
    }
  }

  if (!isIdDefined) {
    reply.send(new HttpError(400, 'Lack of id'))

    return
  }

  await prisma.report.create({
    select: {
      id: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          birth: true,
          media: true,
          createdAt: true,
        },
      },
      content: true,
      createdAt: true,
      comment: {
        select: {
          comment: true,
        },
      },
      post: {
        select: {
          post: true,
        },
      },
      user_: {
        select: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              birth: true,
              media: true,
              createdAt: true,
            },
          },
        },
      },
    },
    data: reportCreation,
  })

  return
}
