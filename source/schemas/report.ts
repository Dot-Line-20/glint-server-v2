import { Schema } from '@library/type'
import { Report } from '@prisma/client'
import commonSchema from '@schemas/common'
import userSchema from '@schemas/user'

export default {
  id: commonSchema.natrualNumber,
  userId: userSchema.id,
  content: commonSchema.content,
  createdAt: commonSchema.dateTime,
} as Schema<keyof Report>
