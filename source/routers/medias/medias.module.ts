import Module from '@library/module'
import { getArraySchema } from '@library/utility'
import mediaSchema from '@schemas/media'
import pageSchema from '@schemas/page'
import userSchema from '@schemas/user'
import deleteMediaController from './deleteMedia.controller'
import deleteMediasManyController from './deleteMediasMany.controller'
import getMediaController from './getMedia.controller'
import getMediasController from './getMedias.controller'
import postMediasController from './postMedias.controller'
import postMediasManyController from './postMediasMany.controller'

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
    {
      method: 'POST',
      url: 'many',
      isAuthNeeded: true,
      handler: postMediasManyController,
    },
    {
      method: 'DELETE',
      url: 'many',
      isAuthNeeded: true,
      schema: {
        body: {
          mediaIds: getArraySchema([mediaSchema.id]),
        },
      },
      handler: deleteMediasManyController,
    },
  ],
  prefix: 'medias',
})
