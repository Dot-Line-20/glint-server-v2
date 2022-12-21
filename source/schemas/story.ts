import { Schema } from '@library/type'
import { Story } from '@prisma/client'
import schema from 'fluent-json-schema'
import commonSchema from '@schemas/common'
import userSchema from '@schemas/user'
import mediaSchema from '@schemas/media'

export default {
  id: commonSchema.natrualNumber,
  userId: userSchema.id,
  mediaId: mediaSchema.id,
  title: commonSchema.name,
  isDeleted: schema.boolean(),
  createdAt: commonSchema.dateTime,
} as Schema<keyof Story>
