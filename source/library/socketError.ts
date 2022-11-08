export default class extends Error {
  isClientError: boolean
  eventName: string

  constructor(isClientError: boolean, eventName: string, message: string) {
    super(message)

    this.isClientError = isClientError
    this.eventName = eventName
  }
}
