import Module from '@library/module'
import pageSchema from '@schemas/page'
import storySchema from '@schemas/story'
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
          storyId: storySchema.id.required(),
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
          storyId: storySchema.id.required(),
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
          storyId: storySchema.id.required(),
          userId: userSchema.id.required(),
        },
        body: {},
      },
      handler: deleteLikeController,
    },
  ],
  modules: [],
  prefix: ':storyId/likes',
})
