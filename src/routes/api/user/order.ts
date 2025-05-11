import { Response, Router } from 'express';

import { transaction } from 'objection';

import { knexPostgres } from 'configs/database';
import objection from 'models/objection';
import Product from 'models/objection/Product';
import { IRequest } from 'types/common';
import { generateOrderCode, responseError, responseSuccess } from 'utils';

const router = Router();

router.get('/', async (req: IRequest<any, any, any, { from: string; to: string }>, res: Response) => {
  try {
    const { from, to } = req.query;

    const query = objection.Order.query().orderBy('id', 'desc'); //.where('userId', req.user.id);

    if (from) {
      query.where('createdAt', '>=', from);
    }
    if (to) {
      query.where('createdAt', '<=', to);
    }

    const result = await query;

    res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.get('/:code', async (req: IRequest<{ code: string }>, res: Response) => {
  try {
    const { code } = req.params;

    const query = objection.Order.query()
      .where('orderCode', code)
      .first()
      .withGraphFetched('orderDetails.[product.files,color.files,size.files]');

    const result = await query;

    res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.post('/', async (req: IRequest<any, any, { products: Product[] }>, res: Response) => {
  const rtx = await transaction.start(knexPostgres);

  try {
    const { products, ...data } = req.body;

    if (!products?.length) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    const result = await objection.Order.query(rtx).insertAndFetch({
      ...data,
      // userId: req.user.id,
      orderCode: generateOrderCode()
    });

    if (products?.length) {
      await objection.OrderDetail.query(rtx).insert(
        products.map(item => ({
          ...item,
          orderId: result.id
        }))
      );
    }

    await rtx.commit();

    res.status(200).json(responseSuccess({ message: 'Created order', data: result }));
  } catch (error) {
    await rtx.rollback();
    res.status(400).json(responseError({ error }));
  }
});

router.post('/check-product-exist', async (req: IRequest<any, any, { productIds: number[] }>, res: Response) => {
  try {
    const { productIds } = req.body;

    const existingIds = await objection.Product.query()
      .whereIn('id', productIds)
      .select('id')
      .then(rows => rows.map(row => row.id));
    const missingIds = productIds.filter(id => !existingIds.includes(id));

    if (!missingIds?.length) {
      return res.status(200).json(responseError({ success: true }));
    }

    return res.status(200).json(responseSuccess({ success: false, data: { existingIds, missingIds } }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

export default router;
