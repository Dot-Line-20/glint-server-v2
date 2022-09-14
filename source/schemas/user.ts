import { Schema } from '@library/type'
import schema from 'fluent-json-schema'
import { User } from '@prisma/client'
import commonSchema from '@schemas/common'

export default {
  id: schema.integer().minimum(0),
  email: schema.string().format('email'),
  password: schema.string(),
  name: schema.string().pattern(/^[a-zA-Z0-9_]{2,32}$/),
  birth: schema.string().format('date'),
  image: schema.string(),
  verificationKey: commonSchema.sha512,
  createdAt: schema.string().format('date-time'),
} as Schema<keyof User>
