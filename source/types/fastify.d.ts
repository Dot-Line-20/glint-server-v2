import { FastifySchema, FastifyTypeProvider, FastifyReply } from 'fastify'
import { RouteGenericInterface } from 'fastify/types/route'
import { IncomingMessage, Server, ServerResponse } from 'http'
import httpError from '@library/httpError'

interface Reply extends RouteGenericInterface {
  Reply:
    | {
        status: 'success' | 'fail'
        data: Record<string, any> | null
      }
    | {
        status: 'error'
        message: string
        code?: number
        data?: Record<string, any> | null
      }
    | httpError
}

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string
    }
  }

  type PayloadReply = FastifyReply<
    Server,
    IncomingMessage,
    ServerResponse,
    Reply,
    unknown,
    FastifySchema,
    FastifyTypeProvider,
    Reply['Reply']
  >
}

export {}
