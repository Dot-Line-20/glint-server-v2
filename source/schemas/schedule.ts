import { Schema } from '@library/type'
import schema from 'fluent-json-schema'
import { Schedule } from '@prisma/client'
import userSchema from '@schemas/user'
import commonSchema from '@schemas/common'

export default {
  id: commonSchema.natrualNumber,
  userId: userSchema.id,
  parentScheduleId: commonSchema.natrualNumber.raw({ nullable: true }),
  type: schema.integer().maximum(4),
  name: commonSchema.name,
  content: commonSchema.content,
  startingAt: commonSchema.dateTime,
  endingAt: commonSchema.dateTime,
  isSuccess: schema.boolean(),
  createdAt: commonSchema.dateTime,
} as Schema<keyof Schedule>
