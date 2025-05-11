import { Request, Response, Router } from 'express';

import { OrderByDirection } from 'objection';

import objection from 'models/objection';
import { IRequest } from 'types/common';
import { responseError, responsePaginationSuccess, responseSuccess } from 'utils';

const router = Router();

router.get('/', async (req: IRequest<any, any, any, { createdAt: OrderByDirection }>, res: Response) => {
  try {
    const { hasPagination, page, pageSize, createdAt } = req.query;
    const queryCategory = objection.Category.query();

    if (createdAt) {
      queryCategory.orderBy('createdAt', createdAt);
    } else {
      queryCategory.orderBy('id', 'desc');
    }

    if (hasPagination) {
      const result = await queryCategory.page(page, pageSize);

      return res.status(200).json(
        responsePaginationSuccess({
          results: result.results,
          total: result.total,
          currentPage: page,
          pageSize
        })
      );
    }

    const result = await queryCategory;

    return res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await objection.Category.query().findOne({ id });

    if (!result) {
      throw new Error('CATEGORY_NOT_FOUND');
    }

    res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const result = await objection.Category.query().insertAndFetch(data);

    res.status(200).json(responseSuccess({ message: 'Created category', data: result }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await objection.Category.query().deleteById(id);

    if (!result) {
      throw new Error('CATEGORY_NOT_FOUND');
    }

    res.status(200).json(responseSuccess({ message: 'Deleted category' }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const result = await objection.Category.query().patchAndFetchById(id, data);

    if (!result) {
      throw new Error('CATEGORY_NOT_FOUND');
    }

    res.status(200).json(responseSuccess({ message: 'Updated category' }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

export default router;
