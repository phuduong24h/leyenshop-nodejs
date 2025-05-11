import { Response, Router } from 'express';

import objection from 'models/objection';
import { IRequest } from 'types/common';
import { responseError, responseSuccess } from 'utils';

const router = Router();

router.get('/', async (req: IRequest, res: Response) => {
  try {
    const result = await objection.Role.query();

    return res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

export default router;
