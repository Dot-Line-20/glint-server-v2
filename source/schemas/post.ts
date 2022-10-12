import { Schema } from '@library/type'
import { Post } from '@prisma/client'
import schema from 'fluent-json-schema'
import commonSchema from '@schemas/common'
import userSchema from '@schemas/user'

export default {
  id: commonSchema.positiveInteger,
  userId: userSchema.id,
  title: schema.string().minLength(1).maxLength(64),
  content: commonSchema.text,
  isDeleted: schema.boolean(),
  createdAt: commonSchema.dateTime,
} as Schema<keyof Post>
