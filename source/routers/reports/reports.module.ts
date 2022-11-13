import Module from '@library/module'
import commentSchema from '@schemas/comment'
import pageSchema from '@schemas/page'
import postSchema from '@schemas/post'
import reportSchema from '@schemas/report'
import userSchema from '@schemas/user'
import deleteReportController from './deleteReport.controller'
import getReportController from './getReport.controller'
import getReportsController from './getReports.controller'
import postReportsController from './postReports.controller'

export default new Module({
  routers: [
    {
      url: '',
      method: 'GET',
      isAuthNeeded: true,
      schema: {
        querystring: pageSchema,
      },
      handler: getReportsController,
    },
    {
      url: '',
      method: 'POST',
      isAuthNeeded: true,
      schema: {
        body: {
          commentId: commentSchema.id,
          postId: postSchema.id,
          userId: userSchema.id,
          content: reportSchema.content.required(),
        },
      },
      handler: postReportsController,
    },
    {
      url: ':id',
      method: 'GET',
      isAuthNeeded: true,
      schema: {
        params: {
          id: reportSchema.id.required(),
        },
      },
      handler: getReportController,
    },
    {
      url: ':id',
      method: 'DELETE',
      isAuthNeeded: true,
      schema: {
        params: {
          id: reportSchema.id.required(),
        },
      },
      handler: deleteReportController,
    },
  ],
  modules: [],
  prefix: 'reports',
})
