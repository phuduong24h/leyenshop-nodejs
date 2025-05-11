import { Request, Response, Router } from 'express';

import objection from 'models/objection';
import { responseError, responseSuccess } from 'utils';

const router = Router();

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await objection.WebThemeDetail.query().deleteById(id);

    if (!result) {
      throw new Error('THEME_NOT_FOUND');
    }

    return res.status(200).json(responseSuccess({ message: 'Xoá theme thành công' }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

export default router;
