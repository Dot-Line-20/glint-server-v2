import { PageQuery, Schema } from '@library/type'
import schema from 'fluent-json-schema'

export default {
  'page[size]': schema.integer().minimum(1).maximum(100),
  'page[index]': schema.integer().minimum(0),
  'page[order]': schema.string().enum(['desc', 'asc']),
} as Schema<keyof PageQuery>
