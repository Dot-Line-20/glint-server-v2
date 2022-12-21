import Module from '@library/module'
import pageSchema from '@schemas/page'
import postSchema from '@schemas/post'
import commentSchema from '@schemas/comment'
import postCommentsController from './postComments.controller'
import getCommentsController from './getComments.controller'
import patchCommentController from './patchComment.controller'
import deleteCommentController from './deleteComment.controller'

export default new Module({
  routers: [
    {
      method: 'POST',
      url: '',
      isAuthNeeded: true,
      schema: {
        params: {
          postId: postSchema.id.required(),
        },
        body: {
          content: commentSchema.content.required(),
        },
      },
      handler: postCommentsController,
    },
    {
      method: 'GET',
      url: '',
      isAuthNeeded: true,
      schema: {
        params: {
          postId: postSchema.id.required(),
        },
        querystring: pageSchema,
      },
      handler: getCommentsController,
    },
    {
      method: 'PATCH',
      url: ':id',
      isAuthNeeded: true,
      schema: {
        params: {
          postId: postSchema.id.required(),
          id: commentSchema.id.required(),
        },
        body: {
          content: commentSchema.content,
        },
      },
      handler: patchCommentController,
    },
    {
      method: 'DELETE',
      url: ':id',
      isAuthNeeded: true,
      schema: {
        params: {
          postId: postSchema.id.required(),
          id: commentSchema.id.required(),
        },
      },
      handler: deleteCommentController,
    },
  ],
  modules: [],
  prefix: ':postId/comments',
})
