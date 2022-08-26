import { FastifyInstance } from 'fastify'
import { join } from 'path/posix'
import { ModuleOptions } from '@library/type'
import authHandler from '../handlers/auth'

// Module
export default class {
  private options: Required<ModuleOptions>

  constructor(options: ModuleOptions) {
    options.modules ||= []
    options.prefix ||= ''

    this.options = options as Required<ModuleOptions>

    return
  }

  public appendPrefix(prefix: string): void {
    this.options.prefix = join(prefix, this.options.prefix)

    return
  }

  public register(fastifyInstance: FastifyInstance): void {
    for (let i: number = 0; i < this.options.routers.length; i++) {
      fastifyInstance.route(
        Object.assign(
          this.options.routers[i],
          {
            url: join(
              fastifyInstance.prefix || '',
              this.options.prefix,
              this.options.routers[i].url
            ),
          },
          this.options.routers[i].isAuthNeeded
            ? { preHandler: authHandler }
            : undefined
        )
      )
    }

    if (this.options.modules.length !== 0) {
      for (let i: number = 0; i < this.options.modules.length; i++) {
        this.options.modules[i].appendPrefix(this.options.prefix)
        this.options.modules[i].register(fastifyInstance)
      }
    }

    return
  }
}
