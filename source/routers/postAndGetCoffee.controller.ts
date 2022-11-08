import HttpError from '@library/httpError'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (request: FastifyRequest, reply: FastifyReply) => {
  reply.send(
    new HttpError(418, "I'm sorry, but this server is powered by Teapot™")
  )

  return
}
