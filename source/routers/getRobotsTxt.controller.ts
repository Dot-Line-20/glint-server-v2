import { FastifyRequest, FastifyReply } from 'fastify'

export default async (request: FastifyRequest, reply: FastifyReply) => {
  reply.raw.write('User-agent: *\nDisallow: /')
  reply.raw.end()

  return
}
