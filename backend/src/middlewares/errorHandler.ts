import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library'
import { Request, Response, NextFunction } from 'express'

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err)

  if (err instanceof PrismaClientKnownRequestError) {
    res.status(400).json({
      error: 'Database error',
      code: err.code,
      message: err.message,
    })
    return
  }

  if (err instanceof PrismaClientValidationError) {
    res.status(400).json({
      error: 'Validation error',
      message: err.message,
    })
    return
  }

  if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
    res.status(404).json({
      error: 'Resource not found',
      message: err.message,
    })
    return
  }

  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'Something went wrong',
  })
  return
}
