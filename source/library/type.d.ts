import {
  FastifyBaseLogger,
  FastifySchema,
  FastifyTypeProvider,
  HTTPMethods,
  RouteHandlerMethod,
  RouteOptions as _RouteOptions,
} from 'fastify'
import { IncomingMessage, Server, ServerResponse } from 'http'
import Module from '@library/module'
import {
  ArraySchema,
  BooleanSchema,
  IntegerSchema,
  JSONSchema,
  NumberSchema,
  ObjectSchema,
  StringSchema,
} from 'fluent-json-schema'
import { Media } from '@prisma/client'

type RecursiveRecord<T extends string | number | symbol, S> = {
  [key in T]: S | RecursiveRecord<T, S>
}

type SchemaKey = 'body' | 'querystring' | 'params' | 'headers'

interface RouteOptions extends Omit<_RouteOptions, 'handler' | 'schema'> {
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
  schema?: Partial<
    Pick<
      RecursiveRecord<
        string,
        | Partial<Record<'$isRequired', boolean>>
        | Omit<Record<string, JSONSchema>, '$isRequired'>
      >,
      SchemaKey
    >
  >
}

interface ModuleOptions {
  routers: readonly (RouteOptions & { isAuthNeeded?: boolean })[]
  modules?: readonly Module[]
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

interface PageQuery extends Record<`page[${'index' | 'size'}]`, number> {
  'page[order]': 'desc' | 'asc'
}
