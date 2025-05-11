import { NextFunction, Response } from 'express';

import { ERROR_CODE } from '@constants';
import objection from 'models/objection';
import { IRequest } from 'types/common';
import { responseError } from 'utils';

export const verifyUserMiddleware = async (req: IRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers || {};
  const token = authorization?.toString?.()?.replace?.('Bearer ', '');

  if (token) {
    try {
      const user = await objection.User.$getInfoByToken(token);

      if (!user) {
        throw new Error(ERROR_CODE.AUTH.UNAUTHORIZED);
      }
      req.user = user;
    } catch (error) {
      res.status(400).json(responseError({ error }));
    }
  }

  next();
};

export const requireUserLoginMiddleware = async (req: IRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers || {};
  const token = authorization?.toString?.()?.replace?.('Bearer ', '');

  if (token) {
    try {
      const user = await objection.User.$getInfoByToken(token);

      if (!user) {
        throw new Error(ERROR_CODE.AUTH.UNAUTHORIZED);
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(400).json(responseError({ error }));
    }
  } else {
    res.status(401).json(responseError({ message: ERROR_CODE.AUTH.UNAUTHORIZED }));
  }
};
