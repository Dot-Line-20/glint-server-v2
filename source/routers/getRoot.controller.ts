import { FastifyRequest, PayloadReply } from 'fastify'

export default (request: FastifyRequest, reply: PayloadReply) => {
  reply.send({
    status: 'success',
    data: [
      {
        message: 'glint',
      },
    ],
  })

  return
}
