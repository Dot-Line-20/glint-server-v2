import HttpError from '@library/httpError'
import JsonWebToken from '@library/jsonWebToken'
import { DoneFuncWithErrOrRes, FastifyRequest, PayloadReply } from 'fastify'

export default (
  request: FastifyRequest,
  reply: PayloadReply,
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

  request.user = {
    id: jsonWebToken.payload.id,
  }

  done()
}
