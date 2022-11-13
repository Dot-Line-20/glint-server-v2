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
    const comment: Pick<Comment, 'userId'> | null =
      await prisma.comment.findUnique({
        select: {
          userId: true,
        },
        where: {
          id: request.body.commentId,
        },
      })

    if (comment === null) {
      reply.send(new HttpError(400, 'Invalid commentId'))

      return
    }

    if (comment.userId === request.userId) {
      reply.send(new HttpError(400, 'Invalid user'))

      return
    }

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

    const post: Pick<Post, 'userId'> | null = await prisma.post.findUnique({
      select: {
        userId: true,
      },
      where: {
        id: request.body.postId,
      },
    })

    if (post === null) {
      reply.send(new HttpError(400, 'Invalid postId'))

      return
    }

    if (post.userId === request.userId) {
      reply.send(new HttpError(400, 'Invalid user'))

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

    const user: Pick<User, 'id'> | null = await prisma.user.findUnique({
      select: {
        id: true,
      },
      where: {
        id: request.body.userId,
      },
    })

    if (user === null) {
      reply.send(new HttpError(400, 'Invalid userId'))

      return
    }

    if (user.id === request.userId) {
      reply.send(new HttpError(400, 'Invalid user'))

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

  reply.send(
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
  )

  return
}
