import { FastifyBaseLogger, LogLevel } from 'fastify'
import { Socket } from 'net'
import { inspect } from 'util'

export default class Logger implements FastifyBaseLogger {
  level: LogLevel | 'silent' = 'silent'

  static log(level: LogLevel, _arguments: Record<string, any>): void {
    if (typeof _arguments[0].req === 'undefined') {
      let print: Socket['write']
      let levelColor = 32

      switch (level) {
        case 'debug':
        case 'trace': {
          return
        }

        case 'error':
        case 'fatal': {
          print = process.stderr.write.bind(process.stderr)
          levelColor--

          break
        }

        case 'warn': {
          levelColor++
        }

        /* eslint-disable */
        default: {
          print = process.stdout.write.bind(process.stdout)
        }
        /* eslint-enable */
      }

      print(
        '[\x1b[36m' +
          new Date().toTimeString().slice(0, 8) +
          '\x1b[37m][\x1b[' +
          levelColor +
          'm' +
          level.toUpperCase() +
          '\x1b[37m]' +
          ' '.repeat(6 - level.length)
      )

      switch (typeof _arguments[0]) {
        case 'string': {
          print(_arguments[0])

          break
        }

        case 'object': {
          if (typeof _arguments[0].res === 'object') {
            print(
              _arguments[0].res.request.ip +
                ' "' +
                _arguments[0].res.request.method +
                ' ' +
                decodeURIComponent(_arguments[0].res.request.url) +
                ' HTTP/' +
                _arguments[0].res.raw.req.httpVersion +
                '" ' +
                _arguments[0].res.raw.statusCode +
                ' "' +
                _arguments[0].res.request.headers['user-agent'] +
                '" (' +
                Math.trunc(_arguments[0].responseTime) +
                'ms)'
            )
          } else {
            print(inspect(_arguments[0], false, null))
          }

          break
        }
      }

      print('\n')
    }

    return
  }

  public info(..._arguments: readonly unknown[]): void {
    Logger.log('info', _arguments)

    return
  }

  public warn(..._arguments: readonly unknown[]): void {
    Logger.log('warn', _arguments)

    return
  }

  public error(..._arguments: readonly unknown[]): void {
    Logger.log('error', _arguments)

    return
  }

  public fatal(..._arguments: readonly unknown[]): void {
    Logger.log('fatal', _arguments)

    return
  }

  public trace(..._arguments: readonly unknown[]): void {
    Logger.log('trace', _arguments)

    return
  }

  public debug(..._arguments: readonly unknown[]): void {
    Logger.log('debug', _arguments)

    return
  }

  public silent(): void {
    return
  }

  public child(): FastifyBaseLogger {
    return this
  }
}
