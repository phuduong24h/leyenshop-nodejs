import { Response, Router } from 'express';

import objection from 'models/objection';
import { IRequest } from 'types/common';
import { responseError, responseSuccess } from 'utils';

const router = Router();

router.get('/', async (req: IRequest, res: Response) => {
  try {
    const query = await objection.Banner.query().withGraphFetched('file');

    res.status(200).json(responseSuccess({ data: query }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.delete('/:id', async (req: IRequest, res: Response) => {
  try {
    const { id } = req.params;

    const query = await objection.Banner.query().deleteById(id);

    res.status(200).json(responseSuccess({ data: query }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.post('/', async (req: IRequest, res: Response) => {
  try {
    const data = req.body;

    const query = await objection.Banner.query().insertAndFetch(data);

    res.status(200).json(responseSuccess({ message: 'Banner added', data: query }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

export default router;
