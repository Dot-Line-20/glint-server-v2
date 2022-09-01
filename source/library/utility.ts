import { RecursiveRecord } from '@library/type'
import schema, { JSONSchema, ObjectSchema } from 'fluent-json-schema'

export function getObjectSchema<T extends string>(
  object: RecursiveRecord<T, JSONSchema>,
  options?: { allowAdditionalProperties?: boolean }
): ObjectSchema {
  const allowAdditionalProperties: boolean =
    typeof options === 'object' &&
    typeof options['allowAdditionalProperties'] === 'boolean' &&
    options['allowAdditionalProperties']
  const schmeaNames: readonly T[] = Object.keys(object) as T[]

  let _schema: ObjectSchema = schema
    .object()
    .additionalProperties(allowAdditionalProperties)

  for (let i: number = 0; i < schmeaNames['length']; i++) {
    _schema = _schema.prop(
      schmeaNames[i],
      object[schmeaNames[i]].hasOwnProperty('isFluentJSONSchema')
        ? (object[schmeaNames[i]] as JSONSchema)
        : getObjectSchema(
            object[schmeaNames[i]] as RecursiveRecord<T, JSONSchema>,
            { allowAdditionalProperties: allowAdditionalProperties }
          )
    )
  }

  return _schema.readOnly(true)
}
