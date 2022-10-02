import { createHmac } from 'crypto'
import { getEpoch } from '@library/utility'

export default class {
  private token: string
  private _secretKey: string
  private _payload: Record<string, any> | null

  constructor(token: string, secretKey: string) {
    this.token = token
    try {
      this._payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64url').toString('utf-8')
      )
    } catch {
      this._payload = null
    }
    this._secretKey = secretKey

    if (this._payload !== null) {
      this.deepFreeze(this._payload)
    }

    return
  }

  public static create(
    payload: Record<string, any>,
    secretKey: string
  ): string {
    const headerAndPayload: string =
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.' +
      Buffer.from(JSON.stringify(payload)).toString('base64url')

    return (
      headerAndPayload +
      '.' +
      createHmac('sha512', secretKey)
        .update(headerAndPayload)
        .digest('base64url')
    )
  }

  public get payload(): typeof this._payload {
    return this._payload
  }

  public set secretKey(secretKey: string) {
    this._secretKey = secretKey
  }

  private deepFreeze(object: Record<string, any> | null): void {
    Object.freeze(object)

    if (object !== null) {
      const keys: readonly string[] = Object.getOwnPropertyNames(object)

      for (let i = 0; i < keys.length; i++) {
        if (
          typeof object[keys[i]] === 'object' &&
          object[keys[i]] !== null &&
          !Object.isFrozen(object[keys[i]])
        ) {
          this.deepFreeze(object[keys[i]])
        }
      }
    }
  }

  public isValid(): boolean {
    const splitTokens: readonly string[] = this.token.split('.')

    return (
      this._payload !== null &&
      createHmac('sha512', this._secretKey)
        .update(splitTokens.slice(0, 2).join('.'))
        .digest('base64url') === splitTokens[2] &&
      (this._payload.exp as number) > getEpoch()
    )
  }
}
