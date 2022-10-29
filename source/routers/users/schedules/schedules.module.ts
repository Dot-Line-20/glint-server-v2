import Module from '@library/module'
import schema from 'fluent-json-schema'
import categorySchema from '@schemas/category'
import commonSchema from '@schemas/common'
import pageSchema from '@schemas/page'
import scheduleSchema from '@schemas/schedule'
import scheduleRepetitionSchema from '@schemas/scheduleRepetition'
import userSchema from '@schemas/user'
import deleteScheduleController from './deleteSchedule.controller'
import getScheduleController from './getSchedule.controller'
import getSchedulesController from './getSchedules.controller'
import getSuccessRateController from './getSuccessRate.controller'
import patchScheduleController from './patchSchedule.controller'
import postSchedulesController from './postSchedules.controller'
import { getArraySchema } from '@library/utility'

export default new Module({
  routers: [
    {
      url: '',
      method: 'POST',
      isAuthNeeded: true,
      schema: {
        params: {
          userId: userSchema.id.required(),
        },
        body: {
          type: scheduleSchema.type.required(),
          parentScheduleId: scheduleSchema.parentScheduleId.required(),
          name: scheduleSchema.name.required(),
          startingAt: scheduleSchema.startingAt.required(),
          endingAt: scheduleSchema.endingAt.required(),
          categoryIds: getArraySchema([categorySchema.id])
            .uniqueItems(true)
            .required(),
          repetitions: getArraySchema([scheduleRepetitionSchema.repeatingAt])
            .uniqueItems(true)
            .required(),
        },
      },
      handler: postSchedulesController,
    },
    {
      url: '',
      method: 'GET',
      isAuthNeeded: true,
      schema: {
        params: {
          userId: userSchema.id.required(),
        },
        querystring: Object.assign(
          {
            depth: commonSchema.positiveInteger,
            isParent: schema.boolean(),
            from: commonSchema.dateTime,
            to: commonSchema.dateTime,
            isSuccess: scheduleSchema.isSuccess,
          },
          pageSchema
        ),
      },
      handler: getSchedulesController,
    },
    {
      url: ':id',
      method: 'GET',
      isAuthNeeded: true,
      schema: {
        params: {
          userId: userSchema.id.required(),
          id: scheduleSchema.id.required(),
        },
        querystring: {
          depth: commonSchema.positiveInteger,
        },
      },
      handler: getScheduleController,
    },
    {
      url: ':id',
      method: 'PATCH',
      isAuthNeeded: true,
      schema: {
        params: {
          userId: userSchema.id.required(),
          id: scheduleSchema.id.required(),
        },
        body: {
          parentScheduleId: scheduleSchema.parentScheduleId,
          type: scheduleSchema.type,
          name: scheduleSchema.name,
          startingAt: scheduleSchema.startingAt,
          endingAt: scheduleSchema.endingAt,
          isSuccess: scheduleSchema.isSuccess,
          categoryIds: getArraySchema([categorySchema.id]).uniqueItems(true),
          repetitions: getArraySchema([
            scheduleRepetitionSchema.repeatingAt,
          ]).uniqueItems(true),
        },
      },
      handler: patchScheduleController,
    },
    {
      url: ':id',
      method: 'DELETE',
      isAuthNeeded: true,
      schema: {
        params: {
          userId: userSchema.id.required(),
          id: scheduleSchema.id.required(),
        },
      },
      handler: deleteScheduleController,
    },
    {
      url: 'successRate',
      method: 'GET',
      isAuthNeeded: true,
      schema: {
        params: {
          userId: userSchema.id.required(),
        },
      },
      handler: getSuccessRateController,
    },
  ],
  modules: [],
  prefix: ':userId/schedules',
})
