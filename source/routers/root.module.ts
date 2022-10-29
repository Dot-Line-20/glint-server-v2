import Module from '@library/module'
import authModule from './auth/auth.module'
import categoriesModule from './categories/categories.module'
import getRobotsTxtController from './getRobotsTxt.controller'
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
    {
      url: 'robots.txt',
      method: 'GET',
      handler: getRobotsTxtController,
    },
  ],
  modules: [
    authModule,
    categoriesModule,
    mediasModule,
    postsModule,
    usersModule,
  ],
  prefix: '',
})
