import { Request, Response } from 'express';

import * as core from 'express-serve-static-core';

import User from 'models/objection/User';

export interface IRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user?: User;
  admin?: User;
  query: ReqQuery & {
    hasPagination?: boolean;
    page?: number;
    pageSize?: number;
  };
}

export interface IResponse extends Response {}

export interface IResponseSuccess {
  success?: boolean;
  status?: number;
  message?: string;
  data?: unknown;
}

export interface IResponseLazySuccess {
  hasPagination?: boolean;
  results?: unknown;
  total: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
}
