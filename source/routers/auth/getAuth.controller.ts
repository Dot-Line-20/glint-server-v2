import { FastifyRequest, PayloadReply } from 'fastify'

export default (request: FastifyRequest, reply: PayloadReply) => {
  reply.send({
    title: 'Auth',
    body: 'User auth module',
  })

  return
}
