import '@library/environment'
import fastify, { FastifyInstance } from 'fastify'
import Logger from './library/logger'
import errorHandler from './handlers/error'
import rootModule from './routers/root.module'

// App
export default class {
  logger: Logger = new Logger()
  app: FastifyInstance

  constructor() {
    this.app = fastify({
      trustProxy: true,
      exposeHeadRoutes: false,
      logger: this.logger,
    })

    this.initializeHandlers()
    this.initializeRouters()

    return
  }

  private initializeHandlers(): void {
    this.app.setErrorHandler(errorHandler)
    // Add more router at here

    return
  }

  private initializeRouters(): void {
    rootModule.appendPrefix('/')
    rootModule.register(this.app)

    return
  }

  public listen(port: number = Number.parseInt(process.env.PORT, 10)): void {
    this.app
      .listen({
        host: '0.0.0.0',
        port: port,
      })
      .then(() => {
        this.logger.info('Route tree:')

        const routeLines: string[] = this.app
          .printRoutes({ commonPrefix: false })
          .split(/^(└──\s|\s{4})/gm)
          .slice(2)

        for (let i = 0; i < routeLines['length']; i++) {
          if (i % 2 === 0) {
            this.logger.info(routeLines[i].replace('\n', ''))
          }
        }

        return
      })

    return
  }
}
