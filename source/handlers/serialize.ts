export default (payload: unknown, statusCode: number) => {
  return JSON.stringify(
    statusCode < 300
      ? {
          status: 'success',
          data: payload,
        }
      : payload
  )
}
