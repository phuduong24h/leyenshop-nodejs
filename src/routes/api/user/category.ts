import { Request, Response, Router } from 'express';

import objection from 'models/objection';
import { responseError, responseSuccess } from 'utils';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await objection.Category.query();

    res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

export default router;
