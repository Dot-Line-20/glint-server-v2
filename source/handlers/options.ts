import { FastifyRequest, PayloadReply } from 'fastify'

export default (request: FastifyRequest, reply: PayloadReply) => {
  reply.send(null)

  return
}
