import Module from '@library/module'
import commonSchema from '@schemas/common'
import userSchema from '@schemas/user'
import getAuthController from './getAuth.controller'
import getEmailController from './getEmail.controller'
import postLoginController from './postLogin.controller'
import postTokenController from './postToken.controller'

export default new Module({
  routers: [
    {
      url: '',
      method: 'GET',
      handler: getAuthController,
    },
    {
      url: 'login',
      method: 'POST',
      schema: {
        body: {
          email: userSchema.email.required(),
          password: userSchema.password.required(),
        },
      },
      handler: postLoginController,
    },
    {
      url: 'token',
      method: 'POST',
      schema: {
        body: {
          refreshToken: commonSchema.jsonWebToken.required(),
        },
      },
      handler: postTokenController,
    },
    {
      url: 'email',
      method: 'GET',
      schema: {
        querystring: {
          verificationKey: commonSchema.sha512.required(),
        },
      },
      handler: getEmailController,
    },
  ],
  prefix: 'auth',
})
