import type { Request } from 'express'
import type * as core from 'express-serve-static-core'

export type RequestBody<T> = Request<core.ParamsDictionary, any, T>

export type SignInRequest = RequestBody<{
  email: string
  password: string
}>

export type SignUpRequest = RequestBody<{
  email: string
  password: string
  name: string
}>

export type KeyRequest = RequestBody<{
  IDNo: string
  CardNo: string
  CardPw: string
  ExpYear: string
  ExpMonth: string
  CardName: string
}>

export type PaymentRequest = RequestBody<{
  productId: string
  cardId: string
}>

export type CancelRequest = RequestBody<{
  transactionId: string
}>
