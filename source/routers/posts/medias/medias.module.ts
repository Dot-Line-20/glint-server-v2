import Module from '@library/module'
import mediaSchema from '@schemas/media'
import postSchema from '@schemas/post'
import deleteMediaController from './deleteMedia.controller'
import getMediasController from './getMedias.controller'
import postMediasController from './postMedias.controller'

export default new Module({
  routers: [
    {
      method: 'GET',
      url: '',
      isAuthNeeded: true,
      schema: {
        params: {
          postId: postSchema.id.required(),
        },
      },
      handler: getMediasController,
    },
    {
      method: 'POST',
      url: '',
      isAuthNeeded: true,
      schema: {
        params: {
          postId: postSchema.id.required(),
        },
        body: {
          mediaId: mediaSchema.id.required(),
        },
      },
      handler: postMediasController,
    },
    {
      method: 'DELETE',
      url: ':mediaId',
      isAuthNeeded: true,
      schema: {
        params: {
          postId: postSchema.id.required(),
          mediaId: mediaSchema.id.required(),
        },
      },
      handler: deleteMediaController,
    },
  ],
  modules: [],
  prefix: ':postsId/medias',
})
