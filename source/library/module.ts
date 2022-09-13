import { FastifyInstance } from 'fastify'
import { join } from 'path/posix'
import { ModuleOptions, RouteOptions, SchemaKey } from '@library/type'
import authHandler from '../handlers/auth'
import schema, { ObjectSchema } from 'fluent-json-schema'
import { FastifySchemaValidationError } from 'fastify/types/schema'

// Module
export default class {
  private options: Required<ModuleOptions>

  constructor(options: ModuleOptions) {
    options.modules ||= []
    options.prefix ||= ''

    this.options = options as Required<ModuleOptions>

    return
  }

  private getObjectSchema(
    object: Required<Required<RouteOptions>['schema']>['body']
  ): ObjectSchema {
    const schmeaNames: readonly string[] = Object.keys(object)

    let _schema: ObjectSchema = schema.object().additionalProperties(false)

    for (let i = 0; i < schmeaNames['length']; i++) {
      if (schmeaNames[i] !== '$isRequired') {
        _schema = _schema.prop(
          schmeaNames[i],
          Object.prototype.hasOwnProperty.call(
            // @ts-expect-error (fault of typescript)
            object[schmeaNames[i]],
            'isFluentJSONSchema'
          )
            ? // @ts-expect-error (fault of typescript)
              object[schmeaNames[i]]
            : this.getObjectSchema(
                // @ts-expect-error (fault of typescript)
                object[schmeaNames[i]]
              )
        )
      }
    }

    if (typeof object.$isRequired === 'boolean' && object.$isRequired) {
      _schema = _schema.required()
    }

    return _schema.readOnly(true)
  }

  private schemaErrorFormatter(
    errors: FastifySchemaValidationError[],
    dataVariableName: string
  ): Error {
    return new Error(
      dataVariableName +
        ' ' +
        (errors[0].instancePath.length !== 0
          ? errors[0]['instancePath'].slice(1) + ' '
          : '') +
        errors[0].message
    )
  }

  public appendPrefix(prefix: string): void {
    this.options.prefix = join(prefix, this.options.prefix)

    return
  }

  public register(fastifyInstance: FastifyInstance): void {
    for (let i = 0; i < this.options.routers.length; i++) {
      let _schema: Partial<Record<SchemaKey, ObjectSchema>>

      if (typeof this.options.routers[i].schema === 'object') {
        _schema = {}

        const schemaKeys: SchemaKey[] = Object.keys(
          this.options.routers[i].schema as object
        ) as SchemaKey[]

        for (let j = 0; j < schemaKeys['length']; j++) {
          _schema[schemaKeys[j]] = this.getObjectSchema(
            (
              this.options.routers[i].schema as Required<
                Required<RouteOptions>['schema']
              >
            )[schemaKeys[j]]
          )
        }
      }

      fastifyInstance.route(
        Object.assign(
          this.options.routers[i],
          {
            url: join(
              fastifyInstance.prefix || '',
              this.options.prefix,
              this.options.routers[i].url
            ),
            // @ts-expect-error (fault of typescript)
            schema: _schema,
          },
          this.options.routers[i].isAuthNeeded
            ? { preHandler: authHandler }
            : undefined,
          {
            schemaErrorFormatter: this.schemaErrorFormatter,
          }
        )
      )
    }

    if (this.options.modules.length !== 0) {
      for (let i = 0; i < this.options.modules.length; i++) {
        this.options.modules[i].appendPrefix(this.options.prefix)
        this.options.modules[i].register(fastifyInstance)
      }
    }

    return
  }
}
