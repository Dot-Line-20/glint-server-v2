import { DoneFuncWithErrOrRes, FastifyRequest, PayloadReply } from 'fastify'

export default (
  request: FastifyRequest,
  reply: PayloadReply,
  done: DoneFuncWithErrOrRes
) => {
  // TODO: Add auth validating logic

  done()
}
