import { Request, Response, Router } from 'express';

import { OrderByDirection } from 'objection';

import objection from 'models/objection';
import File from 'models/objection/File';
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
          })
          .orderBy('createdAt', createdAt || 'desc')
          .withGraphFetched('[category,promotion,colors,sizes,files]');

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

router.post('/', async (req: Request, res: Response) => {
  try {
    const { files, ...data } = req.body;

    const result = await objection.Product.query().insertAndFetch(data);

    if (files?.length) {
      const productFile = files.map((item: File) => ({ productId: result.id, fileId: item.id }));
      await objection.ProductFile.query().insert(productFile);
    }

    const resultProduct = await objection.Product.query()
      .findById(result.id)
      .withGraphFetched('[category,promotion,files]');

    res.status(200).json(responseSuccess({ message: 'Created product', data: resultProduct }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await objection.Product.query().findOne({ id }).withGraphFetched('[category,promotion,files]');

    if (!result) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await objection.Product.query().deleteById(id);

    if (!result) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    objection.ProductFile.query().delete().where('productId', id);

    res.status(200).json(responseSuccess({ message: 'Deleted product' }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { files, ...data } = req.body;

    const result = await objection.Product.query().patchAndFetchById(Number(id), data);

    if (!result) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    if ('files' in req.body) {
      await objection.ProductFile.query().delete().where('productId', id);
      const productFile = files.map((item: File) => ({ productId: result.id, fileId: item.id }));
      if (productFile?.length) {
        await objection.ProductFile.query().insert(productFile);
      }
    }

    res.status(200).json(responseSuccess({ message: 'Updated product' }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

export default router;
