import Module from '@library/module'
import pageSchema from '@schemas/page'
import userSchema from '@schemas/user'
import deleteMediaController from './deleteMedia.controller'
import getMediaController from './getMedia.controller'
import getMediasController from './getMedias.controller'
import postMediasController from './postMedias.controller'

export default new Module({
  routers: [
    {
      method: 'POST',
      url: '',
      isAuthNeeded: true,
      handler: postMediasController,
    },
    {
      method: 'GET',
      url: '',
      isAuthNeeded: true,
      schema: {
        querystring: pageSchema,
      },
      handler: getMediasController,
    },
    {
      method: 'GET',
      url: ':id',
      isAuthNeeded: true,
      schema: {
        params: {
          id: userSchema.id.required(),
        },
      },
      handler: getMediaController,
    },
    {
      method: 'DELETE',
      url: ':id',
      isAuthNeeded: true,
      schema: {
        params: {
          id: userSchema.id.required(),
        },
      },
      handler: deleteMediaController,
    },
  ],
  prefix: 'medias',
})
