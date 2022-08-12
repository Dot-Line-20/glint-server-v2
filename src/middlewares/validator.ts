import Joi from 'joi'

import type { Validation } from 'interface/app'
import type { Request, Response, NextFunction } from 'express'

export default (scheam: Validation) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Joi.object(scheam.body).validateAsync(req[scheam.type])
      next()
    } catch (error: any) {
      res.status(400).json({
        code: 'VALIDATION',
        message: error.message,
      })
    }
  }
