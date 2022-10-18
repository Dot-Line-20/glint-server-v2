import { join } from 'path'
import schema, {
  ArraySchema,
  JSONSchema,
  ObjectSchema,
} from 'fluent-json-schema'
// @ts-expect-error :: No type definition
import { SMTPChannel } from 'smtp-channel'
import { RouteOptions } from './type'

const smtp: SMTPChannel = new SMTPChannel({
  host: 'smtp.gmail.com',
  post: 465,
})

export async function sendMail(
  email: string,
  title: string,
  content: string
): Promise<void> {
  await smtp.connect({ timeout: 3000 })
  await smtp.write('EHLO glint\r\n', { timeout: 3000 })
  await smtp.write('STARTTLS\r\n', { timeout: 3000 })
  await smtp.negotiateTLS({ timeout: 3000 })
  await smtp.write('AUTH LOGIN\r\n', { timeout: 3000 })
  await smtp.write(
    Buffer.from(process.env.EMAIL_USER, 'utf-8').toString('base64') +
      '\r\n' +
      Buffer.from(process.env.EMAIL_PASSWORD, 'utf-8').toString('base64') +
      '\r\nMAIL FROM:<' +
      process.env.EMAIL_USER +
      '> SMTPUTF8\r\nRCPT TO:<' +
      email +
      '>\r\n',
    { timeout: 3000 }
  )
  await smtp.write('DATA\r\n', { timeout: 3000 })
  await smtp.write(
    'From: "Glint" <' +
      process.env.EMAIL_USER +
      '>\r\nTo: <' +
      email +
      '>\r\nSubject: ' +
      title.replace(/\./m, '..') +
      '\r\nContent-Type: text/html; charset="UTF-8";\r\n\r\n' +
      content.replace(/\n/g, '\r\n').replace(/^\./m, '..') +
      '\r\n.\r\nQUIT\r\n',
    { timeout: 3000 }
  )
  await smtp.close()
}

export function getEpoch(): number {
  return Math.trunc(Date.now() / 1000)
}

export function getMediaPath(
  isImage: boolean,
  name: string,
  type: string
): string {
  return join(
    process.cwd(),
    'medias',
    isImage ? 'images' : 'videos',
    name + '.' + type
  )
}

export function getArraySchema(jsonSchemas: JSONSchema[]): ArraySchema {
  return schema.array().items(jsonSchemas).additionalItems(false).readOnly(true)
}

export function getObjectSchema(
  object: Required<Required<RouteOptions>['schema']>['body']
): ObjectSchema {
  const schmeaNames: readonly string[] = Object.keys(object)

  let _schema: ObjectSchema = schema.object().additionalProperties(false)

  if (typeof object.$isRequired === 'boolean' && object.$isRequired) {
    _schema = _schema.required()
  }

  for (let i = 0; i < schmeaNames.length; i++) {
    if (schmeaNames[i] !== '$isRequired') {
      _schema = _schema.prop(
        schmeaNames[i],
        Object.prototype.hasOwnProperty.call(
          // @ts-expect-error :: fault of typescript
          object[schmeaNames[i]],
          'isFluentJSONSchema'
        )
          ? // @ts-expect-error :: fault of typescript
            object[schmeaNames[i]]
          : // @ts-expect-error :: fault of typescript
            getObjectSchema(object[schmeaNames[i]])
      )
    }
  }

  return _schema.readOnly(true)
}
