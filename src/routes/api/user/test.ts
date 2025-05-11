import { Response, Router } from 'express';

import { OrderByDirection } from 'objection';

import objection from 'models/objection';
import { IRequest } from 'types/common';
import { responseError, responsePaginationSuccess, responseSuccess } from 'utils';

const router = Router();

router.get(
  '/',
  async (
    req: IRequest<
      any,
      any,
      any,
      { createdAt: OrderByDirection; categoryIds: number[]; sizeIds: number[]; colorIds: number[] }
    >,
    res: Response
  ) => {
    try {
      const { hasPagination, page, pageSize, createdAt, categoryIds, sizeIds, colorIds } = req.query;

      if (hasPagination) {
        const query = objection.Product.query()
          .distinct('product.*')
          .leftJoinRelated('[colors,sizes]')
          .where(builder => {
            if (colorIds?.length) builder.whereIn('colors.id', colorIds);
            if (sizeIds?.length) builder.whereIn('sizes.id', sizeIds);
            if (categoryIds?.length) builder.whereIn('categoryId', categoryIds);

            if (createdAt) {
              builder.orderBy('createdAt', createdAt);
            } else {
              builder.orderBy('id', 'desc');
            }
          })
          .withGraphFetched('[category,promotion,colors,sizes]');

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

      const result = await objection.Product.query()
        .withGraphFetched('[category,promotion,files,colors.files,sizes.files]')
        .orderBy('id', 'desc');

      res.status(200).json(responseSuccess({ data: result }));
    } catch (error) {
      res.status(400).json(responseError({ error }));
    }
  }
);

export default router;
