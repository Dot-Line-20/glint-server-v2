import { FastifyRequest, FastifyReply } from 'fastify'

export default (request: FastifyRequest, reply: FastifyReply) => {
  reply.send({
    title: 'Auth',
    body: 'User auth module',
  })

  return
}
