import { Schema } from '@library/type'
import { Post } from '@prisma/client'
import schema from 'fluent-json-schema'
import commonSchema from '@schemas/common'
import userSchema from '@schemas/user'

export default {
  id: commonSchema.positiveInteger,
  userId: userSchema.id,
  title: commonSchema.name,
  content: commonSchema.content,
  isDeleted: schema.boolean(),
  createdAt: commonSchema.dateTime,
} as Schema<keyof Post>
