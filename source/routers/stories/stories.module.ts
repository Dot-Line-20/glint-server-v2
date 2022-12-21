import Module from '@library/module'
import categorySchema from '@schemas/category'
import pageSchema from '@schemas/page'
import { getArraySchema } from '@library/utility'
import mediaSchema from '@schemas/media'
import storySchema from '@schemas/story'
import postStoriesController from './postStories.controller'
import getStoriesController from './getStories.controller'
import getStoryController from './getStory.controller'
import patchStoryController from './patchStory.controller'
import deleteStoryController from './deleteStory.controller'
import likesModule from './likes/likes.module'

export default new Module({
  routers: [
    {
      method: 'POST',
      url: '',
      isAuthNeeded: true,
      schema: {
        body: {
          title: storySchema.title.required(),
          mediaId: mediaSchema.id.required(),
          categoryIds: getArraySchema([categorySchema.id], {
            isUniqueItems: true,
          }).required(),
        },
      },
      handler: postStoriesController,
    },
    {
      method: 'GET',
      url: '',
      isAuthNeeded: true,
      schema: {
        querystring: pageSchema,
      },
      handler: getStoriesController,
    },
    {
      method: 'GET',
      url: ':id',
      isAuthNeeded: true,
      schema: {
        params: {
          id: storySchema.id.required(),
        },
      },
      handler: getStoryController,
    },
    {
      method: 'PATCH',
      url: ':id',
      isAuthNeeded: true,
      schema: {
        params: {
          id: storySchema.id.required(),
        },
        body: {
          content: storySchema.title,
          categoryIds: getArraySchema([categorySchema.id], {
            isUniqueItems: true,
          }),
        },
      },
      handler: patchStoryController,
    },
    {
      method: 'DELETE',
      url: ':id',
      isAuthNeeded: true,
      schema: {
        params: {
          id: storySchema.id.required(),
        },
      },
      handler: deleteStoryController,
    },
  ],
  modules: [likesModule],
  prefix: 'stories',
})
