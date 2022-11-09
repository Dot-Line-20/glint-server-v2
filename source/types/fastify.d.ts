import { Server } from 'socket.io'

declare module 'fastify' {
  interface FastifyRequest {
    userId: number
  }
  interface FastifyInstance {
    socketIO: Server
  }
}

export {}
