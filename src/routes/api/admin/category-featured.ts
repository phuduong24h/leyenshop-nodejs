import { Response, Router } from 'express';

import { OrderByDirection, transaction } from 'objection';

import { knexPostgres } from 'configs/database';
import objection from 'models/objection';
import { IRequest } from 'types/common';
import { responseError, responsePaginationSuccess, responseSuccess } from 'utils';

const router = Router();

router.get('/', async (req: IRequest<any, any, any, { createdAt: OrderByDirection }>, res: Response) => {
  try {
    const { hasPagination, page, pageSize, createdAt } = req.query;
    const queryCategory = objection.CategoryFeatured.query().withGraphFetched('[category]');

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

router.get('/:id', async (req: IRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await objection.CategoryFeatured.query().findById(id).withGraphFetched('[category]');

    if (!result) {
      throw new Error('CATEGORY_FEATURED_NOT_FOUND');
    }

    const products = await objection.ProductFeatured.query()
      .where('categoryFeaturedId', result.id)
      .withGraphFetched('product.[files,colors,sizes]');

    return res.status(200).json(responseSuccess({ data: { ...result, products } }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.post('/', async (req: IRequest<any, any, { categoryId: number; productIds: number[] }>, res: Response) => {
  const rtx = await transaction.start(knexPostgres);

  try {
    const { categoryId, productIds } = req.body;

    const categoryFeatured = await objection.CategoryFeatured.query(rtx).insertAndFetch({ categoryId });

    if (!categoryFeatured) {
      throw new Error('CREATE_CATEGORY_FEATURED_FAILED');
    }

    await objection.ProductFeatured.query(rtx).insert(
      productIds.map(productId => ({
        categoryFeaturedId: categoryFeatured.id,
        productId
      }))
    );

    await rtx.commit();

    return res.status(200).json(
      responseSuccess({
        message: 'Created category featured',
        data: {
          categoryFeaturedId: categoryFeatured.id
        }
      })
    );
  } catch (error) {
    await rtx.rollback();
    return res.status(400).json(responseError({ error }));
  }
});

router.delete('/:id', async (req: IRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await objection.CategoryFeatured.query().deleteById(id);

    if (!result) {
      throw new Error('CATEGORY_FEATURED_NOT_FOUND');
    }

    await objection.ProductFeatured.query().delete().where('categoryFeaturedId', id);

    return res.status(200).json(responseSuccess({ message: 'Deleted' }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.put('/:id', async (req: IRequest<any, any, { productIds?: number[]; categoryId?: number }>, res: Response) => {
  const rtx = await transaction.start(knexPostgres);

  try {
    const { id } = req.params;
    const { productIds, categoryId } = req.body;

    await objection.ProductFeatured.query(rtx)
      .delete()
      .where('categoryFeaturedId', id)
      .whereIn('productId', productIds);

    await objection.ProductFeatured.query(rtx).insert(
      productIds.map(productId => ({
        categoryFeaturedId: id,
        categoryId,
        productId
      }))
    );

    await rtx.commit();

    return res.status(200).json(responseSuccess({ message: 'Added product featured' }));
  } catch (error) {
    await rtx.rollback();
    return res.status(400).json(responseError({ error }));
  }
});

export default router;
