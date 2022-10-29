import Module from '@library/module'
import categorySchema from '@schemas/category'
import pageSchema from '@schemas/page'
import getCategoriesController from './getCategories.controller'
import getCategoryController from './getCategory.controller'
import postCategoriesController from './postCategories.controller'

export default new Module({
  routers: [
    {
      method: 'POST',
      url: '',
      isAuthNeeded: true,
      schema: {
        body: {
          name: categorySchema.name,
        },
      },
      handler: postCategoriesController,
    },
    {
      method: 'GET',
      url: '',
      isAuthNeeded: true,
      schema: {
        querystring: Object.assign(
          {
            name: categorySchema.name,
            partialName: categorySchema.name,
          },
          pageSchema
        ),
      },
      handler: getCategoriesController,
    },
    {
      method: 'GET',
      url: ':id',
      isAuthNeeded: true,
      schema: {
        params: {
          id: categorySchema.id.required(),
        },
      },
      handler: getCategoryController,
    },
  ],
  modules: [],
  prefix: 'categories',
})
