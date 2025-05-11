import { Request, Response, Router } from 'express';

import { ERROR_CODE, ROLE } from '@constants';
import objection from 'models/objection';
import { responseError, responseSuccess } from 'utils';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) throw Error(ERROR_CODE.AUTH.INVALID_USERNAME_OR_PASSWORD);

    const query = await objection.User.query()
      .withGraphJoined('role')
      .where('role.roleName', ROLE.ADMIN)
      .findOne({ phone });

    if (!query) {
      throw Error(ERROR_CODE.AUTH.INVALID_USER);
    }

    // if (!user || !objection.User.validPassword(password, user.password)) {
    //   throw new Error(ERROR_CODE.AUTH.INVALID_USER);
    // }

    await query.$query().patch({
      lastLoginAt: new Date()
    });

    res.status(200).json(
      responseSuccess({
        message: 'Login success',
        data: {
          token: query.toJsonWithToken(),
          query
        }
      })
    );
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

export default router;
