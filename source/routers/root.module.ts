import Module from '@library/module'
import authModule from './auth/auth.module'
import categoriesModule from './categories/categories.module'
import chatsModule from './chats/chats.module'
import getRobotsTxtController from './getRobotsTxt.controller'
import getRootController from './getRoot.controller'
import mediasModule from './medias/medias.module'
import postAndGetCoffeeController from './postAndGetCoffee.controller'
import postsModule from './posts/posts.module'
import reportsModule from './reports/reports.module'
import usersModule from './users/users.module'

export default new Module({
  routers: [
    {
      method: 'GET',
      url: '',
      handler: getRootController,
    },
    {
      method: 'POST',
      url: 'coffee',
      handler: postAndGetCoffeeController,
    },
    {
      method: 'GET',
      url: 'coffee',
      handler: postAndGetCoffeeController,
    },
    {
      method: 'GET',
      url: 'robots.txt',
      handler: getRobotsTxtController,
    },
  ],
  modules: [
    authModule,
    categoriesModule,
    chatsModule,
    mediasModule,
    postsModule,
    reportsModule,
    usersModule,
  ],
  prefix: '',
})
