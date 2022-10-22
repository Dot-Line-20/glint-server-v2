import { FastifyError, FastifyRequest, FastifyReply } from 'fastify'

export default (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (typeof error.validation === 'object') {
    error.statusCode = 400
    error.message = error.message[0].toUpperCase() + error.message.slice(1)
  } else if (typeof error.statusCode !== 'number') {
    error.statusCode = 500
  }

  if (error.statusCode === 413) {
    error.message = 'Too '

    switch (error.code) {
      case 'FST_REQ_FILE_TOO_LARGE': {
        error.message += 'large'

        break
      }

      //case 'FST_FILES_LIMIT':
      default: {
        error.message += 'many'
				error.statusCode = 400

        break
      }
    }

    error.message += ' media'
  }

  const isClientError: boolean = (error.statusCode as number) < 500
  const isStackAvailable: boolean =
    typeof error.stack === 'string' && process.env.NODE_ENV === 'development'

  if (!isClientError) {
    const splitLogs: string[] = (error.stack as string).split('\n')

    for (let i = 0; i < splitLogs.length; i++) {
      request.server.log.warn(splitLogs[i])
    }
  }

  reply
    .status(error.statusCode as number)
    .header('Access-Control-Allow-Origin', '*')
    .send(
      isClientError
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
            message:
              error.message + (isStackAvailable ? '; ' + error.stack : ''),
          }
    )

  return
}
