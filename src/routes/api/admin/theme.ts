import { Request, Response, Router } from 'express';

import objection from 'models/objection';
import WebThemeDetail from 'models/objection/WebThemeDetail';
import { IRequest } from 'types/common';
import { responseError, responsePaginationSuccess, responseSuccess } from 'utils';

import themDetail from './themeDetail';

const router = Router();

router.get('/', async (req: IRequest, res: Response) => {
  try {
    const { hasPagination, page, pageSize } = req.query;

    const query = objection.WebTheme.query().withGraphFetched('themes');

    if (hasPagination) {
      const result = await query.page(page, pageSize);

      return res.status(200).json(
        responsePaginationSuccess({
          results: result.results,
          currentPage: page,
          pageSize,
          total: result.total
        })
      );
    }

    const result = await query;

    return res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await objection.WebTheme.query().where('id', id).withGraphFetched('themes').first();

    return res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { themes, ...data } = req.body;

    const result = await objection.WebTheme.query().insertAndFetch(data);

    if ('themes' in req.body && themes?.length) {
      const themeDetail = themes.map((item: WebThemeDetail) => ({ webThemeId: result.id, ...item }));
      await objection.WebThemeDetail.query().insert(themeDetail);
    }

    return res.status(200).json(responseSuccess({ message: 'Thêm theme thành công', data: result }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { themes, ...data } = req.body;

    const result = await objection.WebTheme.query().patchAndFetchById(id, data);

    if (!result) {
      throw new Error('THEME_NOT_FOUND');
    }

    if ('themes' in req.body) {
      await objection.WebThemeDetail.query().delete().where('webThemeId', id);
      const themeDetail = themes.map((item: WebThemeDetail) => ({ webThemeId: result.id, ...item }));
      await objection.WebThemeDetail.query().insert(themeDetail);
    }

    return res.status(200).json(responseSuccess({ message: 'Cập nhật theme thành công' }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await objection.WebTheme.query().deleteById(id);

    if (!result) {
      throw new Error('THEME_NOT_FOUND');
    }

    await objection.WebThemeDetail.query().delete().where('webThemeId', id);

    return res.status(200).json(responseSuccess({ message: 'Xoá theme thành công' }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

// theme detail
router.use('/detail', themDetail);

export default router;
