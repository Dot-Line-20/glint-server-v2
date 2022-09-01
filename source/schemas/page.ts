import schema from 'fluent-json-schema'

export default {
  'page[size]': schema.integer().minimum(1).maximum(100),
  'page[index]': schema.integer(),
  'page[order]': schema.string().enum(['desc', 'asc']),
}
