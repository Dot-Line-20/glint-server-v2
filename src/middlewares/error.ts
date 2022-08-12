import { HttpError } from 'lib/error'

import type { Request, Response, NextFunction } from 'express'

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      code: err.code,
      message: err.message,
    })
  } else {
    console.log(err)
    res.status(500).json({
      code: 'SERVER',
      message: '알 수 없는 오류가 발생했습니다.',
    })
  }
}
