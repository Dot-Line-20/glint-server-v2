import SocketError from '@library/socketError'
import { Chat, ChatUser, Message, User } from '@prisma/client'
import { Event, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import Ajv from 'ajv'
import { getEpoch, getObjectSchema } from '@library/utility'
import commonSchema from '@schemas/common'
import messageSchema from '@schemas/message'
import chatSchema from '@schemas/chat'
import JsonWebToken from '@library/jsonWebToken'
import { prisma } from '@library/prisma'
import { JsendResponse } from '@library/type'

const ajv: Ajv.Ajv = new Ajv({
  coerceTypes: 'array',
  useDefaults: true,
  removeAdditional: true,
  addUsedSchema: false,
  allErrors: false,
})

const bodySchemas = {
  'auth:login': getObjectSchema({
    accessToken: commonSchema.jsonWebToken.required(),
  }).valueOf(),
  'chat:join': getObjectSchema({
    id: chatSchema.id.required(),
  }).valueOf(),
  'chat:leave': getObjectSchema({}).valueOf(),
  'message:create': getObjectSchema({
    content: messageSchema.content.required(),
  }).valueOf(),
  'message:update': getObjectSchema({
    id: messageSchema.id.required(),
    content: messageSchema.content.required(),
  }).valueOf(),
  'message:delete': getObjectSchema({
    id: messageSchema.id.required(),
  }).valueOf(),
} as const

export default async (
  socket: Socket<
    {
      'auth:login': (body: { accessToken: string }) => void
      'chat:join': (body: Pick<Chat, 'id'>) => void
      'message:create': (body: Pick<Message, 'content'>) => void
      'message:update': (body: Pick<Message, 'id' | 'content'>) => void
      'message:delete': (body: Pick<Message, 'id'>) => void
    },
    {
      unknown: (response: JsendResponse) => void
      'auth:login': (response: JsendResponse) => void
      'chat:join': (response: JsendResponse) => void
      'chat:leave': (response: JsendResponse) => void
      'message:create': (response: JsendResponse) => void
      'message:update': (response: JsendResponse) => void
      'message:delete': (response: JsendResponse) => void
    },
    DefaultEventsMap,
    any
  >
) => {
  const user: {
    chatId: Chat['id']
    expireAt: number
  } & Pick<User, 'id'> = {
    id: -1,
    chatId: -1,
    expireAt: -1,
  }

  socket.use(
    async (
      eventArguments: Event,
      next: (error?: Error | undefined) => void
    ) => {
      try {
        switch (eventArguments[0] as keyof typeof bodySchemas) {
          case 'chat:leave': {
            if (user.id === -1 || user.expireAt < getEpoch()) {
              next(
                new SocketError(true, eventArguments[0], 'Unauthorized user')
              )

              return
            }

            if (eventArguments[1] !== null) {
              next(
                new SocketError(true, eventArguments[0], 'Body should be null')
              )

              return
            }

            break
          }
          case 'message:create':
          case 'message:update':
          case 'message:delete':
          case 'chat:join': {
            if (user.id === -1 || user.expireAt < getEpoch()) {
              next(
                new SocketError(true, eventArguments[0], 'Unauthorized user')
              )

              return
            }
          }
          /* eslint-disable */
          case 'auth:login': {
            const isValid: Ajv.ValidateFunction = ajv.compile(
              bodySchemas[eventArguments[0] as keyof typeof bodySchemas]
            )

            if (!isValid(eventArguments[1])) {
              next(
                new SocketError(
                  true,
                  eventArguments[0],
                  'Body ' +
                    ((isValid.errors as Ajv.ErrorObject[])[0].dataPath
                      .length !== 0
                      ? (isValid.errors as Ajv.ErrorObject[])[0].dataPath.slice(
                          1
                        ) + ' '
                      : '') +
                    (isValid.errors as Ajv.ErrorObject[])[0].message
                )
              )

              return
            }
            break
          }
          /* eslint-enable */

          default: {
            next(new SocketError(true, eventArguments[0], 'Not found'))

            return
          }
        }

        next()
      } catch {
        next(new SocketError(true, eventArguments[0], 'Invalid body'))
      }

      return
    }
  )

  socket.on('error', async (error: Error) => {
    if (!(error instanceof SocketError)) {
      Object.assign(error, {
        isClientError: false,
        eventName: 'unknown',
      })
    }

    const isStackAvailable: boolean =
      typeof error.stack === 'string' && process.env.NODE_ENV === 'development'

    socket.emit(
      (error as SocketError).eventName as keyof typeof bodySchemas,
      (error as SocketError).isClientError
        ? {
            status: 'fail',
            data: {
              title: error.message,
              body: isStackAvailable ? error.stack : undefined,
            },
          }
        : {
            status: 'error',
            message:
              error.message + (isStackAvailable ? '; ' + error.stack : ''),
          }
    )

    return
  })

  socket.on('auth:login', async (body: { accessToken: string }) => {
    try {
      const jsonWebToken: JsonWebToken = new JsonWebToken(
        body.accessToken,
        process.env.JWT_SECRET
      )

      if (!jsonWebToken.isValid()) {
        socket._onerror(
          new SocketError(true, 'auth:login', 'Invalid accessToken')
        )

        return
      }

      Object.assign(user, {
        id: (jsonWebToken.payload as NonNullable<typeof jsonWebToken.payload>)
          .id,
        expireAt: (
          jsonWebToken.payload as NonNullable<typeof jsonWebToken.payload>
        ).exp,
      })

      socket.emit('auth:login', {
        status: 'success',
        data: {
          id: user.id,
        },
      })
    } catch (error: any) {
      socket._onerror(
        Object.assign(error, {
          isClientError: false,
          eventName: 'auth:login',
        })
      )
    }

    return
  })

  socket.on('chat:join', async (body: Pick<Chat, 'id'>) => {
    try {
      const chat: {
        users: Pick<ChatUser, 'userId'>[]
      } | null = await prisma.chat.findUnique({
        select: {
          users: {
            where: {
              userId: user.id,
            },
          },
        },
        where: body,
      })

      if (chat === null) {
        socket._onerror(new SocketError(true, 'chat:join', 'Invalid id'))

        return
      }

      if (chat.users.length !== 1) {
        socket._onerror(new SocketError(true, 'chat:join', 'Unauthorized user'))

        return
      }

      const chatIdStrings: string[] = Array.from(socket.rooms)

      for (let i = 0; i < chatIdStrings.length; i++) {
        await socket.leave(chatIdStrings[i])
      }

      await socket.join(body.id.toString(10))

      user.chatId = body.id

      socket.emit('chat:join', {
        status: 'success',
        data: {
          id: user.chatId,
        },
      })
    } catch (error: any) {
      socket._onerror(
        Object.assign(error, {
          isClientError: false,
          eventName: 'chat:join',
        })
      )
    }

    return
  })

  socket.onAnyOutgoing((eventName: string) => {
    if (eventName === 'chat:leave') {
      user.chatId = -1
    }

    return
  })

  socket.on('message:create', async (body: Pick<Message, 'content'>) => {
    try {
      if (user.chatId === -1) {
        socket._onerror(
          new SocketError(true, 'message:create', 'Invalid chatId')
        )

        return
      }

      socket.in(user.chatId.toString(10)).emit('message:create', {
        status: 'success',
        data: await prisma.message.create({
          select: {
            id: true,
            userId: true,
            content: true,
            createdAt: true,
          },
          data: Object.assign(body, {
            user: {
              connect: {
                id: user.id,
              },
            },
            chat: {
              connect: {
                id: user.chatId,
              },
            },
          }),
        }),
      })
    } catch (error: any) {
      socket._onerror(
        Object.assign(error, {
          isClientError: false,
          eventName: 'message:create',
        })
      )
    }

    return
  })

  socket.on('message:update', async (body: Pick<Message, 'id' | 'content'>) => {
    try {
      if (user.chatId === -1) {
        socket._onerror(
          new SocketError(true, 'message:update', 'Invalid chatId')
        )

        return
      }

      const message: Pick<Message, 'userId'> | null =
        await prisma.message.findUnique({
          select: {
            userId: true,
          },
          where: {
            id: body.id,
          },
        })

      if (message === null) {
        socket._onerror(new SocketError(true, 'message:update', 'Invalid id'))

        return
      }

      if (message.userId !== user.id) {
        socket._onerror(
          new SocketError(true, 'message:update', 'Unauthorized user')
        )

        return
      }

      socket.in(user.chatId.toString(10)).emit('message:update', {
        status: 'success',
        data: await prisma.message.update({
          select: {
            id: true,
            content: true,
          },
          data: {
            content: body.content,
          },
          where: {
            id: body.id,
          },
        }),
      })
    } catch (error: any) {
      socket._onerror(
        Object.assign(error, {
          isClientError: false,
          eventName: 'message:update',
        })
      )
    }

    return
  })

  socket.on('message:delete', async (body: Pick<Message, 'id'>) => {
    try {
      if (user.chatId === -1) {
        socket._onerror(
          new SocketError(true, 'message:delete', 'Invalid chatId')
        )

        return
      }

      const message: Pick<Message, 'userId'> | null =
        await prisma.message.findUnique({
          select: {
            userId: true,
          },
          where: {
            id: body.id,
          },
        })

      if (message === null) {
        socket._onerror(new SocketError(true, 'message:delete', 'Invalid id'))

        return
      }

      if (message.userId !== user.id) {
        socket._onerror(
          new SocketError(true, 'message:delete', 'Unauthorized user')
        )

        return
      }

      socket.in(user.chatId.toString(10)).emit('message:delete', {
        status: 'success',
        data: await prisma.message.delete({
          select: {
            id: true,
          },
          where: {
            id: body.id,
          },
        }),
      })
    } catch (error: any) {
      socket._onerror(
        Object.assign(error, {
          isClientError: false,
          eventName: 'message:delete',
        })
      )
    }

    return
  })

  return
}
