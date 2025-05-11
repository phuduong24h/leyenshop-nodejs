import { Request, Response, Router } from 'express';

import objection from 'models/objection';
import File from 'models/objection/File';
import { IRequest } from 'types/common';
import { responseError, responsePaginationSuccess, responseSuccess } from 'utils';

const router = Router();

router.get('/', async (req: IRequest<any, any, any, { productId: number }>, res: Response) => {
  try {
    const { hasPagination, page, pageSize, productId } = req.query;

    const query = objection.Size.query().withGraphFetched('files');

    if (productId) {
      query.where('productId', productId);
    }

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

router.post('/', async (req: Request, res: Response) => {
  try {
    const { files, ...data } = req.body;

    const result = await objection.Size.query().insertAndFetch(data);

    if (files?.length) {
      const sizeFile = files.map((item: File) => ({ sizeId: result.id, fileId: item.id }));
      await objection.SizeFile.query().insert(sizeFile);
    }

    const resultSize = await objection.Size.query().findById(result.id).withGraphFetched('files');

    res.status(200).json(responseSuccess({ message: 'Created size', data: resultSize }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { productId } = req.query;

    const result = await objection.Size.query().findOne({ id, productId }).withGraphFetched('files');

    if (!result) {
      throw new Error('SIZE_NOT_FOUND');
    }

    res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await objection.Size.query().deleteById(id);

    if (!result) {
      throw new Error('SIZE_NOT_FOUND');
    }

    objection.SizeFile.query().delete().where('sizeId', id);

    res.status(200).json(responseSuccess({ message: 'Deleted size' }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { files, ...data } = req.body;

    const result = await objection.Size.query().patchAndFetchById(id, data);

    if (!result) {
      throw new Error('SIZE_NOT_FOUND');
    }

    if ('files' in req.body) {
      await objection.SizeFile.query().delete().where('sizeId', id);
      const sizeFile = files.map((item: File) => ({ sizeId: result.id, fileId: item.id }));
      if (sizeFile) {
        await objection.SizeFile.query().insert(sizeFile);
      }
    }

    res.status(200).json(responseSuccess({ message: 'Updated size' }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

export default router;
