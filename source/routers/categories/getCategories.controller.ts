import HttpError from '@library/httpError'
import { prisma } from '@library/prisma'
import { PageQuery } from '@library/type'
import { Category } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Querystring: Partial<
      {
        partialName: Category['name']
      } & Pick<Category, 'name'> &
        PageQuery
    >
  }>,
  reply: FastifyReply
) => {
  request.query['page[size]'] ||= 50
  request.query['page[index]'] ||= 0

  const isPartialNameDefined: boolean =
    typeof request.query.partialName === 'string'

  let categories: Category[]

  if (isPartialNameDefined) {
    if (typeof request.query.name === 'string') {
      reply.send(new HttpError(400, 'Duplicated name condition'))
    }

    categories =
      await prisma.$queryRaw`SELECT * FROM \`category\` WHERE \`name\` LIKE ${
        '%' + request.query.partialName + '%'
      } ORDER BY NOT \`name\` LIKE ${
        request.query.partialName + '%'
      }, \`name\` LIMIT ${
        request.query['page[size]'] * request.query['page[index]']
      }, ${request.query['page[size]']}`

    for (let i = 0; i < categories.length; i++) {
      categories[i].id = Number(categories[i].id)
    }
  } else {
    categories = await prisma.category.findMany({
      where: {
        name: request.query.name,
      },
      skip: request.query['page[size]'] * request.query['page[index]'],
      take: request.query['page[size]'],
      orderBy: {
        id: request.query['page[order]'] === 'asc' ? 'asc' : 'desc',
      },
    })
  }

  reply.send(categories)

  return
}
