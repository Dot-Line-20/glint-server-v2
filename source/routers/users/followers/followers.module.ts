import Module from '@library/module'
import pageSchema from '@schemas/page'
import userSchema from '@schemas/user'
import userFollower from '@schemas/userFollower'
import deleteFollowerController from './deleteFollower.controller'
import getFollowersController from './getFollowers.controller'
import postFollowersController from './postFollowers.controller'

export default new Module({
  routers: [
    {
      url: '',
      method: 'POST',
      isAuthNeeded: true,
      schema: {
        params: {
          userId: userSchema.id.required(),
        },
        body: {},
      },
      handler: postFollowersController,
    },
    {
      url: '',
      method: 'GET',
      isAuthNeeded: true,
      schema: {
        params: {
          userId: userSchema.id.required(),
        },
        querystring: Object.assign({}, pageSchema, {
          'page[order]': undefined,
        }),
      },
      handler: getFollowersController,
    },
    {
      url: ':id',
      method: 'DELETE',
      isAuthNeeded: true,
      schema: {
        params: {
          userId: userSchema.id.required(),
          id: userFollower.userId.required(),
        },
        body: {},
      },
      handler: deleteFollowerController,
    },
  ],
  modules: [],
  prefix: ':userId/followers',
})
