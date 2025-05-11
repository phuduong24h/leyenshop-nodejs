import { Request, Response, Router } from 'express';

import { responseError, responseSuccess } from 'utils';

const router = Router();

router.get('/category', async (req: Request, res: Response) => {
  try {
    return res.status(200).json(responseSuccess({}));
  } catch (error) {
    return res.status(500).json(responseError({ error }));
  }
});

export default router;
