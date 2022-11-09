import { Schema } from '@library/type'
import schema from 'fluent-json-schema'
import { User } from '@prisma/client'
import commonSchema from '@schemas/common'

export default {
  id: commonSchema.natrualNumber,
  email: schema.string().format('email'),
  password: schema.string(),
  name: commonSchema.name,
  birth: commonSchema.date,
  mediaId: commonSchema.natrualNumber,
  verificationKey: commonSchema.sha512,
  createdAt: commonSchema.dateTime,
} as Schema<keyof User>
