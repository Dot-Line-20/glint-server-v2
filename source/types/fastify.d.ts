import { FastifySchema, FastifyTypeProvider, FastifyReply } from 'fastify'
import { RouteGenericInterface } from 'fastify/types/route'
import { IncomingMessage, Server, ServerResponse } from 'http'

interface Reply extends RouteGenericInterface {
  Reply: Record<string, any> | null
}

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: number
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
