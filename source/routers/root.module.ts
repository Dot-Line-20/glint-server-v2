import Module from '@library/module'
import authModule from './auth/auth.module'
import getRootController from './getRoot.controller'

export default new Module({
  routers: [
    {
      url: '',
      method: 'GET',
      handler: getRootController,
    },
  ],
  modules: [authModule],
  prefix: '',
})
