import { Schema } from '@library/type'
import { Category } from '@prisma/client'
import commonSchema from '@schemas/common'

export default {
  id: commonSchema.natrualNumber,
  name: commonSchema.name,
} as Schema<keyof Category>
