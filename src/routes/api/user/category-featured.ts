import { Response, Router } from 'express';

import { OrderByDirection } from 'objection';

import objection from 'models/objection';
import { IRequest } from 'types/common';
import { responseError, responsePaginationSuccess, responseSuccess } from 'utils';

const router = Router();

router.get('/', async (req: IRequest<any, any, any, { createdAt: OrderByDirection }>, res: Response) => {
  try {
    const { hasPagination, page, pageSize, createdAt } = req.query;
    const queryCategory = objection.CategoryFeatured.query().withGraphFetched(
      '[category,products.[category,files,colors.files,sizes.files]]'
    );

    if (createdAt) {
      queryCategory.orderBy('createdAt', createdAt);
    } else {
      queryCategory.orderBy('id', 'asc');
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

export default router;
