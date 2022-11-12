import Module from '@library/module'
import pageSchema from '@schemas/page'
import postSchema from '@schemas/post'
import userSchema from '@schemas/user'
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
        querystring: Object.assign({}, pageSchema, {
          'page[order]': undefined,
        }),
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
