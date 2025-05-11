import { Response, Router } from 'express';

import { ERROR_CODE } from '@constants';
import objection from 'models/objection';
import { IRequest } from 'types/common';
import { responseError, responseSuccess } from 'utils';

const router = Router();

router.get('/', async (req: IRequest, res: Response) => {
  try {
    const { id } = req.user || {};

    const result = await objection.User.query().findOne({ id });

    if (!result) {
      throw new Error('USER_NOT_FOUND');
    }

    res.status(200).json(responseSuccess({ data: result }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.put('/', async (req: IRequest, res: Response) => {
  try {
    const { id } = req.user || {};
    const data = req.body;

    const result = await objection.User.query().patchAndFetchById(id, data);

    if (!result) {
      throw new Error('USER_NOT_FOUND');
    }

    res.status(200).json(responseSuccess({ message: 'Updated user', data: result }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

router.put('/change-password', async (req: IRequest, res: Response) => {
  try {
    const { id } = req.user || {};
    const { oldPassword, newPassword } = req.body;

    const user = await objection.User.query().findById(id);

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    if (!objection.User.validPassword(oldPassword, user.password)) {
      throw new Error(ERROR_CODE.PASSWORD.WRONG_PASSWORD);
    }

    await user.$query().patch({
      password: objection.User.generateHashPassword(newPassword)
    });

    res.status(200).json(responseSuccess({ message: 'Updated password' }));
  } catch (error) {
    res.status(400).json(responseError({ error }));
  }
});

export default router;
