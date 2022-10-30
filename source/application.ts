import '@library/environment'
import fastify, { FastifyInstance } from 'fastify'
import Logger from './library/logger'
import errorHandler from './handlers/error'
import rootModule from './routers/root.module'
import notFoundHandler from './handlers/notFound'
import serializeHandler from './handlers/serialize'
import optionsHandler from './handlers/options'
import headerHandler from './handlers/header'
import fastifyMultipart from '@fastify/multipart'
import { mkdir } from 'fs/promises'
import { join } from 'path/posix'

// App
export default class {
  application: FastifyInstance

  constructor() {
    this.application = fastify({
      trustProxy: true,
      exposeHeadRoutes: false,
      logger: new Logger(),
    })

    this.initializeMedias()
    this.initializeHandlers()
    this.initializeRouters()

    return
  }

  private async initializeMedias(): Promise<void> {
		console.log(join(process.env.MEDIAS_PATH, 'medias/images'))
    await mkdir(join(process.env.MEDIAS_PATH, 'medias/images'), {
      recursive: true,
    })
    await mkdir(join(process.env.MEDIAS_PATH, 'medias/videos'), {
      recursive: true,
    })

    return
  }

  private initializeHandlers(): void {
    this.application.setNotFoundHandler(notFoundHandler)
    this.application.setErrorHandler(errorHandler)
    this.application.setReplySerializer(serializeHandler)
    this.application.addHook('preHandler', headerHandler)
    this.application.register(fastifyMultipart, {
      throwFileSizeLimit: true,
      limits: {
        fileSize: 52428800, // 50mb
      },
    })

    return
  }

  private initializeRouters(): void {
    rootModule.appendPrefix('/')
    rootModule.register(this.application)
    this.application.options('*', optionsHandler)

    return
  }

  public async listen(
    port: number = Number.parseInt(process.env.PORT, 10)
  ): Promise<void> {
    await this.application.listen({
      host: '0.0.0.0',
      port: port,
    })

    this.application.log.info('Route tree:')

    const routeLines: readonly string[] = this.application
      .printRoutes({ commonPrefix: false })
      .split(/^(└──\s|\s{4})/gm)
      .slice(2)

    for (let i = 0; i < routeLines.length; i++) {
      if (i % 2 === 0) {
        this.application.log.info(routeLines[i].replace('\n', ''))
      }
    }

    return
  }
}
