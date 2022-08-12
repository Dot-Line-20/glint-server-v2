import crypto from 'crypto'

export default (b: number) => crypto.randomBytes(b).toString('hex')
