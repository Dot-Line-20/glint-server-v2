import { FastifyRequest, PayloadReply } from 'fastify'
import { User } from '@prisma/client'
import prisma from '@library/prisma'
import HttpError from '@library/httpError'
import { argon2id, hash } from 'argon2'
import { randomBytes } from 'crypto'
import { sendMail } from '@library/utility'

export default async (
  request: FastifyRequest<{
    Body: Pick<User, 'email' | 'password' | 'name' | 'birth'>
  }>,
  reply: PayloadReply
) => {
  if (
    (await prisma.user.findUnique({
      select: null,
      where: {
        email: request.body.email,
      },
    })) !== null
  ) {
    reply.send(new HttpError(400, 'Duplicated email'))

    return
  }

  const verificationKey: string = randomBytes(64).toString('hex')

  await sendMail(
    request.body.email,
    'Glint 계정 인증',
    '<p>' +
      request['body']['name'] +
      '님, 안녕하세요.</p><br><p>계정의 생성이 확인되었습니다,</p><p><a href="http://h2o.vg/auth/email?verificationKey=' +
      verificationKey +
      '">여기</a>를 눌러 이메일을 인증해주세요.</p><br><p>만약 이를 요청하지 않으셨다면, 이메일 도용의 가능성이 있으니 <a href="mailto:' +
      process.env.EMAIL_USER +
      '">회답</a>해주시길 바랍니다.</p><br><hr><br><p>Glint | <a href="http://h2o.vg/">http://h2o.vg/</a></p>'
  )

  try {
    reply.send({
      status: 'success',
      data: [
        await prisma.user.create({
          select: {
            id: true,
          },
          data: Object.assign(request.body, {
            password: await hash(request.body.password, {
              type: argon2id,
              hashLength: Number.parseInt(process.env.ARGON_KEY_LENGTH, 10),
              saltLength: Number.parseInt(process.env.ARGON_SALT_LENGTH, 10),
              memoryCost: Number.parseInt(process.env.ARGON_MEMORY, 10),
              timeCost: Number.parseInt(process.env.ARGON_ITERATION, 10),
            }),
            verificationKey: verificationKey,
            birth: new Date(request.body.birth),
          }),
        }),
      ],
    })
  } catch (error: any) {
    reply.send(new HttpError(500, 'Unexpected database error'))
    reply.log.error(error)
  }

  return
}
