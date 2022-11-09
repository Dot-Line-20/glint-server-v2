import Module from '@library/module'
import { getArraySchema } from '@library/utility'
import chatSchema from '@schemas/chat'
import pageSchema from '@schemas/page'
import userSchema from '@schemas/user'
import getChatsController from './getChats.controller'
import messagesModule from './messages/messages.module'
import patchChatController from './patchChat.controller'
import postChatsController from './postChats.controller'

export default new Module({
  routers: [
    {
      method: 'POST',
      url: '',
      isAuthNeeded: true,
      schema: {
        body: {
          name: chatSchema.name.required(),
          userIds: getArraySchema([userSchema.id], {
            minimumLength: 2,
            isUniqueItems: true,
          }).required(),
        },
      },
      handler: postChatsController,
    },
    {
      method: 'GET',
      url: '',
      isAuthNeeded: true,
      schema: {
        querystring: Object.assign(pageSchema),
      },
      handler: getChatsController,
    },
    {
      method: 'PATCH',
      url: ':id',
      isAuthNeeded: true,
      schema: {
        params: {
          id: chatSchema.id.required(),
        },
        body: {
          name: chatSchema.name,
          userIds: getArraySchema([userSchema.id], {
            isUniqueItems: true,
          }),
        },
      },
      handler: patchChatController,
    },
  ],
  modules: [messagesModule],
  prefix: 'chats',
})
