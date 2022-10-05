import { Schema } from '@library/type'
import schema from 'fluent-json-schema'

export default {
  positiveInteger: schema.integer().minimum(0),
  sha512: schema.string().pattern(/^[0-9a-f]{128}$/),
  date: schema.string().format('date'),
  dateTime: schema.string().format('date-time'),
  jsonWebToken: schema.string().pattern(/^(?:[\w-]*\.){2}[\w-]*$/),
} as Schema<
  'positiveInteger' | 'sha512' | `date${'' | 'Time'}` | 'jsonWebToken'
>
