import Module from '@library/module'
import chatSchema from '@schemas/chat'
import messageSchema from '@schemas/message'
import pageSchema from '@schemas/page'
import deleteMessageController from './deleteMessage.controller'
import getMessagesController from './getMessages.controller'
import postMessagesController from './postMessages.controller'

export default new Module({
  routers: [
    {
      method: 'POST',
      url: '',
      isAuthNeeded: true,
      schema: {
        params: {
          chatId: chatSchema.id.required(),
        },
        body: {
          content: messageSchema.content.required(),
        },
      },
      handler: postMessagesController,
    },
    {
      method: 'GET',
      url: '',
      isAuthNeeded: true,
      schema: {
        params: {
          chatId: chatSchema.id.required(),
        },
        querystring: pageSchema,
      },
      handler: getMessagesController,
    },
    {
      method: 'PATCH',
      url: ':id',
      isAuthNeeded: true,
      schema: {
        params: {
          chatId: chatSchema.id.required(),
          id: messageSchema.id.required(),
        },
        body: {
          content: messageSchema.content,
        },
      },
      handler: postMessagesController,
    },
    {
      method: 'DELETE',
      url: ':id',
      isAuthNeeded: true,
      schema: {
        params: {
          chatId: chatSchema.id.required(),
          id: messageSchema.id.required(),
        },
      },
      handler: deleteMessageController,
    },
  ],
  modules: [],
  prefix: ':chatId/messages',
})
