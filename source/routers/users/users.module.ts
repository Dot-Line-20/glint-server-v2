import Module from '@library/module'
import pageSchema from '@schemas/page'
import userSchema from '@schemas/user'
import getUserController from './getUser.controller'
import getUsersController from './getUsers.controller'
import postUsersController from './postUsers.controller'
import schedulesModule from './schedules/schedules.module'

export default new Module({
  routers: [
    {
      url: '',
      method: 'GET',
      isAuthNeeded: true,
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
    {
      url: ':id',
      method: 'GET',
      isAuthNeeded: true,
      schema: {
        params: {
          id: userSchema.id.required(),
        },
      },
      handler: getUserController,
    },
    {
      url: ':id',
      method: 'PATCH',
      isAuthNeeded: true,
      schema: {
        params: {
          id: userSchema.id.required(),
        },
				body: {
					
				}
      },
      handler: getUserController,
    },
    {
      url: ':id',
      method: 'DELETE',
      isAuthNeeded: true,
      schema: {
        params: {
          id: userSchema.id.required(),
        },
      },
      handler: getUserController,
    },
  ],
  modules: [schedulesModule],
  prefix: 'users',
})
