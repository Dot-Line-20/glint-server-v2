import Module from '@library/module'
import pageSchema from '@schemas/page'
import userSchema from '@schemas/user'
import deleteMediaController from './deleteMedia.controller'
import getMediaController from './getMedia.controller'
import getMediasController from './getMedias.controller'
import postMediasController from './postMedias.controller'
import postSchema from '@schemas/post'
import { getArraySchema, getObjectSchema } from '@library/utility'

export default new Module({
  routers: [
    {
      method: 'POST',
      url: '',
      isAuthNeeded: true,
      schema: {
        body: {
          medias: getArraySchema([
            getObjectSchema({
              userId: userSchema.id.required(),
            }),
            getObjectSchema({
              postId: postSchema.id.required(),
            }),
          ]).required(),
        },
      },
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
