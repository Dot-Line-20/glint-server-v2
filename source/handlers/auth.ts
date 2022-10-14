import HttpError from '@library/httpError'
import JsonWebToken from '@library/jsonWebToken'
import { DoneFuncWithErrOrRes, FastifyRequest, FastifyReply } from 'fastify'

export default (
  request: FastifyRequest,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes
) => {
  if (
    typeof request.headers.authorization !== 'string' ||
    !request.headers.authorization.startsWith('Bearer ')
  ) {
    reply.send(new HttpError(400, 'Invalid authorization'))

    return
  }

  const jsonWebToken: JsonWebToken = new JsonWebToken(
    request.headers.authorization.slice(7),
    process.env.JWT_SECRET
  )

  if (jsonWebToken.payload === null || !jsonWebToken.isValid()) {
    reply.send(new HttpError(400, 'Invalid authorization'))

    return
  }

  request.userId = jsonWebToken.payload.id

  done()
}
