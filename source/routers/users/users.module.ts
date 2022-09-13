import Module from '@library/module'
import pageSchema from '@schemas/page'
import userSchema from '@schemas/user'
import getUsersController from './getUsers.controller'
import postUsersController from './postUsers.controller'

export default new Module({
  routers: [
    {
      url: '',
      method: 'GET',
      schema: {
        querystring: pageSchema,
      },
      handler: getUsersController,
    },
    {
      url: '',
      method: 'POST',
      schema: {
        body: {
          email: userSchema.email.required(),
          password: userSchema.password.required(),
          name: userSchema.name.required(),
          birth: userSchema.birth.required(),
        },
      },
      handler: postUsersController,
    },
  ],
  modules: [],
  prefix: 'users',
})
