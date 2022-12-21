import HttpError from '@library/httpError'
import { prisma } from '@library/prisma'
import { Report } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: Pick<Report, 'id'>
  }>,
  reply: FastifyReply
) => {
  const report: Pick<Report, 'userId'> | null = await prisma.report.findUnique({
    select: {
      userId: true,
    },
    where: {
      id: request.params.id,
    },
  })

  if (report === null) {
    reply.callNotFound()

    return
  }

  if (report.userId !== request.userId) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  reply.send(
    await prisma.report.findUnique({
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
        story: {
          select: {
            story: true,
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
      where: {
        id: request.params.id,
      },
    })
  )

  return
}
