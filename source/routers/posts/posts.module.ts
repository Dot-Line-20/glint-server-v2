import Module from '@library/module'
import pageSchema from '@schemas/page'
import postSchema from '@schemas/post'
import postPostsController from './postPosts.controller'
import getPostsController from './getPosts.controller'
import getPostController from './getPost.controller'
import patchPostController from './patchPost.controller'
import deletePostController from './deletePost.controller'
import commentsModule from './comments/comments.module'
import likesModule from './likes/likes.module'
import { getArraySchema } from '@library/utility'
import mediaSchema from '@schemas/media'

export default new Module({
  routers: [
    {
      method: 'POST',
      url: '',
      isAuthNeeded: true,
      schema: {
        body: {
          title: postSchema.title.required(),
          content: postSchema.content.required(),
          mediaIds: getArraySchema([mediaSchema.id], {
            minimumLength: 1,
            maximumLength: 10,
          }),
        },
      },
      handler: postPostsController,
    },
    {
      method: 'GET',
      url: '',
      isAuthNeeded: true,
      schema: {
        querystring: pageSchema,
      },
      handler: getPostsController,
    },
    {
      method: 'GET',
      url: ':id',
      isAuthNeeded: true,
      schema: {
        params: {
          id: postSchema.id.required(),
        },
      },
      handler: getPostController,
    },
    {
      method: 'PATCH',
      url: ':id',
      isAuthNeeded: true,
      schema: {
        params: {
          id: postSchema.id.required(),
        },
        body: {
          title: postSchema.title,
          content: postSchema.content,
          mediaIds: getArraySchema([mediaSchema.id], {
            minimumLength: 0,
            maximumLength: 10,
          }),
        },
      },
      handler: patchPostController,
    },
    {
      method: 'DELETE',
      url: ':id',
      isAuthNeeded: true,
      schema: {
        params: {
          id: postSchema.id.required(),
        },
      },
      handler: deletePostController,
    },
  ],
  modules: [commentsModule, likesModule],
  prefix: 'posts',
})
