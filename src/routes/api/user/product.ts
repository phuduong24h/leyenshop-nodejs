import { Request, Response, Router } from 'express';

import objection from 'models/objection';
import { IRequest } from 'types/common';
import { responseError, responsePaginationSuccess, responseSuccess, sortJSON } from 'utils';

const router = Router();

router.get(
  '/',
  async (req: IRequest<any, any, any, { search: string; categoryId: number; sorts: string[] }>, res: Response) => {
    try {
      const { hasPagination, page, pageSize, search, categoryId, sorts } = req.query;

      const query = objection.Product.query();

      if (sorts?.length) {
        sortJSON(query, sorts);
      }

      if (categoryId) {
        query.where('categoryId', '=', categoryId);
      }

      if (search) {
        query.where('name', 'ilike', `%${search}%`);
      }

      query.withGraphFetched('[files,category,colors.[files],sizes.[files]]');

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
  }
);

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await objection.Product.query()
      .withGraphFetched('[files,category,colors.[files],sizes.[files]]')
      .findOne({ id });

    if (!result) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

export default router;
