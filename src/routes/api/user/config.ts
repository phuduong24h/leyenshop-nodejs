import { Request, Response, Router } from 'express';

import objection from 'models/objection';
import { responseError, responseSuccess } from 'utils';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const info = await objection.WebInfo.query().first();
    const theme = await objection.WebTheme.query().where('isActive', true).withGraphFetched('[themes]').first();
    const banner = await objection.Banner.query().withGraphFetched('file');

    const bannerPinned = banner.filter(item => item.isPin);
    const bannerUnPinned = banner.filter(item => !item.isPin);

    return res.status(200).json(
      responseSuccess({
        data: {
          info,
          theme,
          bannerPinned,
          bannerUnPinned
        }
      })
    );
  } catch (error) {
    return res.status(500).json(responseError({ error }));
  }
});

export default router;
