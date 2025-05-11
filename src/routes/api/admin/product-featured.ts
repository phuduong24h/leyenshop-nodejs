import { Response, Router } from 'express';

import objection from 'models/objection';
import { IRequest } from 'types/common';
import { responseError, responseSuccess } from 'utils';

const router = Router();

router.post('/:id', async (req: IRequest<{ id: number }>, res: Response) => {
  try {
    const { id: categoryFeaturedId } = req.params;

    const { productId } = req.body;
    const result = await objection.ProductFeatured.query().insertAndFetch({
      productId,
      categoryFeaturedId
    });

    return res.status(200).json(responseSuccess({ message: 'Create product featured successfully', data: result }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.delete('/:id', async (req: IRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await objection.ProductFeatured.query().deleteById(id);

    return res.status(200).json(responseSuccess({ message: 'Create product featured successfully', data: result }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

export default router;
