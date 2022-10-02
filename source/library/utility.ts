import { createTransport, Transporter } from 'nodemailer'

const transport: Transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  tls: {},
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendMail(
  email: string,
  title: string,
  body: string
): Promise<void> {
  await transport.sendMail({
    from: 'Glint <' + process.env.EMAIL_USER + '>',
    to: email,
    subject: title,
    html: body,
  })

  return
}

export function getEpoch(): number {
  return Math.trunc(Date.now() / 1000)
}