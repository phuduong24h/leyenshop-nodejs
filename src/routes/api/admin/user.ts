import { Response, Router } from 'express';

import objection from 'models/objection';
import { IRequest } from 'types/common';
import { responseError, responsePaginationSuccess, responseSuccess } from 'utils';

const router = Router();

router.get('/', async (req: IRequest, res: Response) => {
  try {
    const { hasPagination, page, pageSize } = req.query;

    const query = objection.User.query().withGraphJoined('[role,file]').orderBy('createdAt', 'desc');

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

    return res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.put('/change-password', async (req: IRequest, res: Response) => {
  try {
    const { userId, password } = req.body;

    const user = await objection.User.query().findById(userId);

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    await user.$query().updateAndFetch({ password });

    return res.status(200).json(responseSuccess({ message: 'Change password successfully' }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.get('/:id', async (req: IRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await objection.User.query().withGraphJoined('[role,file]').findById(id);

    if (!result) {
      throw new Error('USER_NOT_FOUND');
    }

    return res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.delete('/:id', async (req: IRequest, res: Response) => {
  try {
    const { id } = req.params;

    const query = await objection.User.query().deleteById(id);

    res.status(200).json(responseSuccess({ data: query }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.put('/:id', async (req: IRequest, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const query = await objection.User.query().updateAndFetchById(id, body);

    res.status(200).json(responseSuccess({ data: query }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.post('/', async (req: IRequest, res: Response) => {
  try {
    const body = req.body;

    const query = await objection.User.query().insertAndFetch(body);

    res.status(200).json(responseSuccess({ data: query }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

export default router;
