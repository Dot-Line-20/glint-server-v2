import { FastifyRequest, PayloadReply } from 'fastify'

export default (request: FastifyRequest, reply: PayloadReply) => {
  reply.send({
    status: 'success',
    data: [
      {
        title: 'Auth',
        body: 'User auth module',
      },
    ],
  })

  return
}
