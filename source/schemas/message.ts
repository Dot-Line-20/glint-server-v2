import { Schema } from '@library/type'
import { Message } from '@prisma/client'
import commonSchema from '@schemas/common'
import userSchema from '@schemas/user'
import chatSchema from '@schemas/chat'

export default {
  id: commonSchema.natrualNumber,
  chatId: chatSchema.id,
  userId: userSchema.id,
  content: commonSchema.content,
  createdAt: commonSchema.dateTime,
} as Schema<keyof Message>
