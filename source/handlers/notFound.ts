import HttpError from '@library/httpError'
import { FastifyRequest, PayloadReply } from 'fastify'

export default (request: FastifyRequest, reply: PayloadReply) => {
  reply.send(new HttpError(404, 'Page not found'))

  return
}
