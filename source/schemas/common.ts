import { Schema } from '@library/type'
import schema from 'fluent-json-schema'

export default {
  natrualNumber: schema
    .integer()
    .minimum(1)
    .maximum(4294967295 /* 2 ** 32 - 1 */),
  sha512: schema.string().pattern(/^[0-9a-f]{128}$/),
  date: schema.string().format('date'),
  dateTime: schema.string().format('date-time'),
  name: schema.string().minLength(1).maxLength(64),
  content: schema.string().minLength(1).maxLength(65535),
  jsonWebToken: schema.string().pattern(/^(?:[\w-]*\.){2}[\w-]*$/),
} as Schema<
  | 'natrualNumber'
  | 'sha512'
  | `date${'' | 'Time'}`
  | 'name'
  | 'content'
  | 'jsonWebToken'
>
