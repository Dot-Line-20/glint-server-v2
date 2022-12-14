import { Schema } from '@library/type'
import { Comment } from '@prisma/client'
import schema from 'fluent-json-schema'
import commonSchema from '@schemas/common'
import userSchema from '@schemas/user'
import postSchema from '@schemas/post'

export default {
  id: commonSchema.natrualNumber,
  userId: userSchema.id,
  postId: postSchema.id,
  content: commonSchema.content,
  isDeleted: schema.boolean(),
  createdAt: commonSchema.dateTime,
} as Schema<keyof Comment>
