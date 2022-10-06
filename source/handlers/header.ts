import { DoneFuncWithErrOrRes, FastifyRequest, PayloadReply } from 'fastify'

export default (
  request: FastifyRequest,
  reply: PayloadReply,
  done: DoneFuncWithErrOrRes
) => {
  reply.removeHeader('Access-Control-Allow-Origin')

  // Replaces helmet and cors package
  reply.headers({
    'Content-Security-Policy':
      "default-src 'self';base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Expect-CT': 'max-age=0',
    'Origin-Agent-Cluster': '?1',
    'Referrer-Policy': 'no-referrer',
    'Strict-Transport-Security': 'max-age=15552000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-DNS-Prefetch-Control': 'off',
    'X-Download-Options': 'noopen',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'X-XSS-Protection': '0',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PATCH,POST,DELETE',
    'Access-Control-Allow-Headers':
      'Origin,X-Requested-With,Content-Type,Accept',
  })

  done()
}
