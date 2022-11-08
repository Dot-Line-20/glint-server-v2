import { Schema } from '@library/type'
import { Chat } from '@prisma/client'
import commonSchema from '@schemas/common'

export default {
  id: commonSchema.natrualNumber,
  name: commonSchema.name,
} as Schema<keyof Chat>
