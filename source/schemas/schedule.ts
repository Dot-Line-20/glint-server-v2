import { Schema } from '@library/type'
import schema from 'fluent-json-schema'
import { Schedule } from '@prisma/client'
import userSchema from '@schemas/user'
import commonSchema from '@schemas/common'

export default {
  id: commonSchema.positiveInteger,
  userId: userSchema.id,
  parentScheduleId: commonSchema.positiveInteger.raw({ nullable: true }),
  name: schema.string().minLength(1).maxLength(64),
  startingAt: commonSchema.dateTime,
  endingAt: commonSchema.dateTime,
  isSuccess: schema.boolean(),
  createdAt: commonSchema.dateTime,
} as Schema<keyof Schedule>
