import { Schema } from '@library/type'
import schema from 'fluent-json-schema'
import { User } from '@prisma/client'
import commonSchema from '@schemas/common'

export default {
  id: commonSchema.positiveInteger,
  email: schema.string().format('email'),
  password: schema.string().minLength(1).maxLength(64),
  name: schema.string().pattern(/^[a-zA-Z0-9_]{2,32}$/),
  birth: commonSchema.date,
  image: schema.string(),
  verificationKey: commonSchema.sha512,
  createdAt: commonSchema.dateTime,
} as Schema<keyof User>
