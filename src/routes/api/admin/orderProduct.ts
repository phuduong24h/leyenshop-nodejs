import { Request, Response, Router } from 'express';

import objection from 'models/objection';
import { IRequest } from 'types/common';
import { responseError, responsePaginationSuccess, responseSuccess } from 'utils';

const router = Router();

router.get('/:id/products', async (req: IRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { hasPagination, page, pageSize } = req.query;

    const query = objection.OrderDetail.query().where('orderId', id);

    if (hasPagination) {
      const result = await query.withGraphFetched('[product,size.files,color.files]').page(page, pageSize);

      return res.status(200).json(
        responsePaginationSuccess({
          results: result.results,
          total: result.total,
          currentPage: page,
          pageSize
        })
      );
    }

    const result = await query;

    return res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.get('/:id/product', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await objection.OrderDetail.query()
      .findOne({ id })
      .withGraphFetched('[product,size,size.files,color,color.files]')
      .first();

    if (!result) {
      throw new Error('ORDER_PRODUCT_NOT_FOUND');
    }

    return res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.post('/:id/product', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const resultOrder = await objection.Order.query().findOne({ id });

    if (!resultOrder) {
      throw new Error('ORDER_PRODUCT_NOT_FOUND');
    }

    const result = await objection.OrderDetail.query().insert({ orderId: id, ...data });

    return res.status(200).json(responseSuccess({ message: 'Created order detail', data: result }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.put('/:id/product', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const result = await objection.OrderDetail.query().patchAndFetchById(id, data);

    if (!result) {
      throw new Error('ORDER_PRODUCT_NOT_FOUND');
    }

    return res.status(200).json(responseSuccess({ message: 'Updated order product', data: result }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.delete('/:id/product', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await objection.OrderDetail.query().findOne({ id });

    if (!result) {
      throw new Error('ORDER_PRODUCT_NOT_FOUND');
    }

    await objection.OrderDetail.query().deleteById(id);

    return res.status(200).json(responseSuccess({ message: 'Deleted order product' }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

export default router;
