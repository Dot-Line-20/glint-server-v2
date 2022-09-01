import Module from '@library/module'
import getAuthController from './getAuth.controller'

export default new Module({
  routers: [
    {
      url: '',
      method: 'GET',
      handler: getAuthController,
    },
  ],
  prefix: 'auth',
})
