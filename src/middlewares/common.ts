import { NextFunction, Response } from 'express';

import { IRequest } from 'types/common';

export const checkPaginationMiddleware = (req: IRequest, _: Response, next: NextFunction) => {
  if ('page' in req.query && 'pageSize' in req.query) {
    req.query.hasPagination = true;
    req.query.page = Number(req.query.page);
    req.query.pageSize = Number(req.query.pageSize);
  }
  next();
};

export const validationMiddleware =
  (schema: any) =>
  async (req: IRequest, res: Response, next: NextFunction): Promise<Response> => {
    try {
      await schema().validate({
        ...req.query,
        ...req.body
      });
      next();
    } catch (error) {
      return res.status(400).json({ error });
    }
  };
