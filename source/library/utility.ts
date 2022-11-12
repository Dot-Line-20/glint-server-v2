import { Media } from '@prisma/client'
import schema, {
  ArraySchema,
  JSONSchema,
  NullSchema,
  ObjectSchema,
} from 'fluent-json-schema'
import { join } from 'path'
// @ts-expect-error :: No type definition
import { SMTPChannel } from 'smtp-channel'
import { RouteOptions } from './type'

const smtp: SMTPChannel = new SMTPChannel({
  host: 'smtp.gmail.com',
  post: 465,
})

const fileMagicNumber = {
  gif: Buffer.from([0x47, 0x49, 0x46, 0x38]),
  jpg: Buffer.from([0xff, 0xd8, 0xff]),
  png: Buffer.from([0x89, 0x50, 0x4e, 0x47]),
  mp4: Buffer.from([0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d]), // mp4 version 2
  mp4_: Buffer.from([0x66, 0x74, 0x79, 0x70, 0x6d, 0x70, 0x34, 0x32]),
  mov: Buffer.from([0x66, 0x74, 0x79, 0x70]),
} as const

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
      '>\r\nSubject: =?UTF-8?B?' +
      Buffer.from(title.replace(/\./m, '..'), 'utf-8').toString('base64') +
      '?=\r\nContent-Type: text/html; charset="UTF-8";\r\n\r\n' +
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
  media: Omit<Media, 'id' | 'userId' | 'createdAt'>
): string {
  return join(
    process.env.MEDIAS_PATH,
    'medias',
    media.isImage ? 'images' : 'videos',
    media.name + '.' + media.type
  )
}

export function isCorrectFileType(type: string, buffer: Buffer): boolean {
  switch (type) {
    /* eslint-disable */
    case 'mp4': {
      if (buffer.includes(fileMagicNumber.mp4_)) {
        return true
      }
    }
    default: {
      return buffer.includes(
        fileMagicNumber[type as keyof typeof fileMagicNumber]
      )
    }
    /* eslint-enable */
  }
}

export function getArraySchema(
  jsonSchemas: JSONSchema[],
  options: Partial<
    {
      isUniqueItems: boolean
    } & Record<`${'max' | 'min'}imumLength`, number>
  > = {}
): ArraySchema {
  let _schema: ArraySchema = schema.array()

  for (let i = 0; i < jsonSchemas.length; i++) {
    _schema = _schema.items(jsonSchemas[i])
  }

  if (typeof options.maximumLength === 'number') {
    _schema = _schema.maxItems(options.maximumLength)
  }

  if (typeof options.minimumLength === 'number') {
    _schema = _schema.minItems(options.minimumLength)
  }

  if (options.isUniqueItems === true) {
    _schema = _schema.uniqueItems(true)
  }

  return _schema.readOnly(true)
}

export function getObjectSchema(
  object: Required<Required<RouteOptions>['schema']>['body']
): ObjectSchema | NullSchema {
  const schmeaNames: readonly string[] = Object.keys(object)

  let _schema: ObjectSchema = schema.object().additionalProperties(false)

  if (object.$isRequired === true) {
    _schema = _schema.required()
  }

  for (let i = 0; i < schmeaNames.length; i++) {
    if (
      schmeaNames[i] !== '$isRequired' &&
      // @ts-expect-error :: fault of typescript
      typeof object[schmeaNames[i]] === 'object'
    ) {
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
