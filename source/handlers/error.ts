import { FastifyError, FastifyRequest, PayloadReply } from 'fastify'

export default (
  request: FastifyRequest,
  reply: PayloadReply,
  error: FastifyError
) => {
  if (typeof error.validation === 'object') {
    error.statusCode = 400
  } else if (typeof error.statusCode !== 'number') {
    error.statusCode = 500
  }

  const isStackAvailable: boolean =
    typeof error.stack === 'string' && process.env.NODE_ENV === 'development'

  reply.status(error.statusCode as number)

  reply.send(
    (error.statusCode as number) < 500
      ? {
          status: 'fail',
          data: [
            Object.assign(
              {
                title: error.message,
              },
              isStackAvailable ? { body: error.stack } : undefined
            ),
          ],
        }
      : {
          status: 'error',
          code: error.statusCode,
          message: error.message + (isStackAvailable ? '; ' + error.stack : ''),
        }
  )

  return
}
