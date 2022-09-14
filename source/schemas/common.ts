import { Schema } from '@library/type'
import schema from 'fluent-json-schema'

export default {
  sha512: schema.string().pattern(/^[0-9a-f]{128}$/),
} as Schema<'sha512'>
