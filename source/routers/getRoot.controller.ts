import { FastifyRequest, FastifyReply } from 'fastify'

export default (request: FastifyRequest, reply: FastifyReply) => {
  reply.send({
    message: 'glint',
  })

  return
}
