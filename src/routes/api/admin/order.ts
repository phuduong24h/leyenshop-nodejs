import { Request, Response, Router } from 'express';

import { transaction } from 'objection';

import { knexPostgres } from 'configs/database';
import objection from 'models/objection';
import Product from 'models/objection/Product';
import { IRequest } from 'types/common';
import { generateOrderCode, responseError, responsePaginationSuccess, responseSuccess } from 'utils';

import orderProduct from './orderProduct';
const router = Router();

router.get('/', async (req: IRequest, res: Response) => {
  try {
    const { hasPagination, page, pageSize } = req.query;

    const query = objection.Order.query().orderBy('id', 'desc');

    if (hasPagination) {
      const result = await query.page(page, pageSize);

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

    res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.post('/', async (req: IRequest<any, any, { products: Product[] }>, res: Response) => {
  const rtx = await transaction.start(knexPostgres);

  try {
    const { products, ...data } = req.body;

    const result = await objection.Order.query(rtx).insertAndFetch({ ...data, orderCode: generateOrderCode() });

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

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await objection.Order.query().findOne({ id }).withGraphFetched('[user]');

    if (!result) {
      throw new Error('ORDER_NOT_FOUND');
    }

    res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await objection.Order.query().deleteById(id);

    if (!result) {
      throw new Error('ORDER_NOT_FOUND');
    }

    objection.OrderDetail.query().delete().where('id', id);

    res.status(200).json(responseSuccess({ message: 'Deleted order' }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const result = await objection.Order.query().patchAndFetchById(Number(id), data);

    if (!result) {
      throw new Error('ORDER_NOT_FOUND');
    }

    res.status(200).json(responseSuccess({ message: 'Updated order' }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.get('/:id/total_price', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await objection.OrderDetail.query().where('id', id).withGraphFetched('[size]');

    if (!result) {
      throw new Error('ORDER_NOT_FOUND');
    }

    const totalPrice = result.reduce((total, item) => {
      return total + item.unitPrice * item.quantity;
    }, 0);

    res.status(200).json(responseSuccess({ data: { totalPrice } }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

// order product
router.use(orderProduct);

export default router;
