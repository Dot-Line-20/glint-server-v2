import Module from '@library/module'
import postSchema from '@schemas/post'
import userSchema from '@schemas/user'
import schema from 'fluent-json-schema'
import deleteLikeController from './deleteLike.controller'
import getLikesController from './getLikes.controller'
import postLikesController from './postLikes.controller'

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
      handler: getLikesController,
    },
    {
      method: 'POST',
      url: '',
      isAuthNeeded: true,
      schema: {
        params: {
          postId: postSchema.id.required(),
        },
        body: {},
      },
      handler: postLikesController,
    },
    {
      method: 'DELETE',
      url: ':userId',
      isAuthNeeded: true,
      schema: {
        params: {
          postId: postSchema.id.required(),
          userId: userSchema.id.required(),
        },
        body: {},
      },
      handler: deleteLikeController,
    },
  ],
  modules: [],
  prefix: ':postId/likes',
})
