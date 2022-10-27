import { FastifyRequest, FastifyReply } from 'fastify'

export default async (request: FastifyRequest, reply: FastifyReply) => {
  reply.send({
    message: 'glint',
  })

  return
}
