import {
  FastifyBaseLogger,
  FastifySchema,
  FastifyTypeProvider,
  HTTPMethods,
  RouteHandlerMethod,
  RouteOptions as _RouteOptions,
} from 'fastify'
import { IncomingMessage, Server, ServerResponse } from 'http'
import module from '@library/module'

interface RouteOptions extends Omit<_RouteOptions, 'handler'> {
  method: HTTPMethods
  handler: RouteHandlerMethod<
    Server,
    IncomingMessage,
    ServerResponse,
    any,
    any,
    FastifySchema,
    FastifyTypeProvider,
    FastifyBaseLogger
  >
}

interface ModuleOptions {
  routers: (RouteOptions & { isAuthNeeded?: boolean })[]
  modules?: module[]
  prefix?: string
}

type Schema<T extends string> = Record<
  T,
  | ObjectSchema
  | StringSchema
  | NumberSchema
  | ArraySchema
  | IntegerSchema
  | BooleanSchema
>

type RecursiveRecord<T extends string | number | symbol, S> = {
  [key in T]: S | RecursiveRecord<T, S>
}
