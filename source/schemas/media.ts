import { Schema } from '@library/type'
import { Media } from '@prisma/client'
import schema from 'fluent-json-schema'
import commonSchema from '@schemas/common'
import userSchema from '@schemas/user'

export default {
  id: commonSchema.natrualNumber,
  name: commonSchema.sha512,
  type: schema.string().enum(['gif', 'jpg', 'jpeg', 'png', 'mp4', 'mov']),
  userId: userSchema.id,
  isImage: schema.boolean(),
  createdAt: commonSchema.dateTime,
} as Schema<keyof Media>
