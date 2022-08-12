import signin from './signin'
import signup from './signup'
import refresh from './refresh'
import user from './user'

import Joi from 'joi'
import checkRouter from 'lib/checkRouter'

export default checkRouter({
  root: '/auth',
  routers: [
    {
      path: '/signin',
      method: 'post',
      needAuth: false,
      handler: signin,
      validation: {
        type: 'body',
        body: {
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        },
      },
    },
    {
      path: '/signup',
      method: 'post',
      needAuth: false,
      handler: signup,
      validation: {
        type: 'body',
        body: {
          email: Joi.string().email().required(),
          password: Joi.string().required(),
          name: Joi.string().required(),
        },
      },
    },
    {
      path: '/refresh',
      method: 'get',
      needAuth: false,
      handler: refresh,
    },
    {
      path: '/user',
      method: 'get',
      needAuth: true,
      handler: user,
    }
  ],
})
