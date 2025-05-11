import { Request, Response, Router } from 'express';

import { OrderByDirection } from 'objection';

import objection from 'models/objection';
import { IRequest } from 'types/common';
import { responseError, responsePaginationSuccess, responseSuccess } from 'utils';

const router = Router();

router.get(
  '/',
  async (req: IRequest<any, any, any, { status?: string[]; createdAt: OrderByDirection }>, res: Response) => {
    try {
      const { hasPagination, page, pageSize, status, createdAt } = req.query;
      const queryPromotion = objection.Promotion.query();

      if (createdAt) {
        queryPromotion.orderBy('createdAt', createdAt);
      } else {
        queryPromotion.orderBy('id', 'desc');
      }
      if (status) {
        queryPromotion.orWhereIn('status', status);
      }

      if (hasPagination) {
        const result = await queryPromotion.page(page, pageSize);
        return res.status(200).json(
          responsePaginationSuccess({
            results: result.results,
            total: result.total,
            currentPage: page,
            pageSize
          })
        );
      }

      const result = await queryPromotion;
      return res.status(200).json(responseSuccess({ data: result }));
    } catch (error) {
      res.status(400).json(responseError({ error }));
    }
  }
);

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await objection.Promotion.query().findOne({ id });

    if (!result) {
      throw new Error('PROMOTION_NOT_FOUND');
    }

    res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const result = await objection.Promotion.query().insertAndFetch(data);

    res.status(200).json(responseSuccess({ message: 'Created promotion', data: result }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await objection.Promotion.query().deleteById(id);

    if (!result) {
      throw new Error('PROMOTION_NOT_FOUND');
    }

    res.status(200).json(responseSuccess({ message: 'Deleted promotion' }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const result = await objection.Promotion.query().patchAndFetchById(id, data);

    if (!result) {
      throw new Error('PROMOTION_NOT_FOUND');
    }

    res.status(200).json(responseSuccess({ message: 'Updated promotion' }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

export default router;
