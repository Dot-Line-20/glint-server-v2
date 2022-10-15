import HttpError from '@library/httpError'
import { FastifyRequest, FastifyReply } from 'fastify'

export default (request: FastifyRequest, reply: FastifyReply) => {
  reply.send(new HttpError(404, 'Page not found'))

  return
}
