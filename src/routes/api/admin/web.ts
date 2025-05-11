import { Request, Response, Router } from 'express';

import objection from 'models/objection';
import { responseError, responseSuccess } from 'utils';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await objection.WebInfo.query().first();

    return res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.put('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const queryOne = await objection.WebInfo.query().first();

    const query = objection.WebInfo.query();

    if (queryOne) {
      query.patchAndFetchById(queryOne.id, data);
    } else {
      query.insert(data);
    }

    const result = await query;

    return res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

export default router;
