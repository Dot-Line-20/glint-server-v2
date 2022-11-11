import Module from '@library/module'
import chatSchema from '@schemas/chat'
import messageSchema from '@schemas/message'
import pageSchema from '@schemas/page'
import getMessagesController from './getMessages.controller'

export default new Module({
  routers: [
    {
      method: 'GET',
      url: '',
      isAuthNeeded: true,
      schema: {
        params: {
          chatId: chatSchema.id.required(),
        },
        querystring: Object.assign(
          {
            startingId: messageSchema.id,
          },
          pageSchema
        ),
      },
      handler: getMessagesController,
    },
  ],
  modules: [],
  prefix: ':chatId/messages',
})
