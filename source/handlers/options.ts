import { FastifyRequest, FastifyReply } from 'fastify'

export default (request: FastifyRequest, reply: FastifyReply) => {
  reply.send(null)

  return
}
