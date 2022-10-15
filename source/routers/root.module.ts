import Module from '@library/module'
import authModule from './auth/auth.module'
import getRootController from './getRoot.controller'
import mediasModule from './medias/medias.module'
import postsModule from './posts/posts.module'
import usersModule from './users/users.module'

export default new Module({
  routers: [
    {
      url: '',
      method: 'GET',
      handler: getRootController,
    },
  ],
  modules: [authModule, mediasModule, postsModule, usersModule],
  prefix: '',
})
