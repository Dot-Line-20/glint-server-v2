export default (payload: unknown, statusCode: number) => {
  payload ||= null

  return JSON.stringify(
    statusCode < 300
      ? {
          status: 'success',
          data: payload,
        }
      : payload
  )
}
