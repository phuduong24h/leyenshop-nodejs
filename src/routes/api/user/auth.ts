import { Request, Response, Router } from 'express';

import dayjs from 'dayjs';

import { ERROR_CODE, isDevelopment, ROLE } from '@constants';
import { validationMiddleware } from 'middlewares';
import objection from 'models/objection';
import { IRequest } from 'types/common';
import { IForgotPassword, IResetPassword, ISignUp, IVerifyCode } from 'types/user';
import { generateOTP, responseError, responseSuccess, signUpSchema } from 'utils';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) throw Error(ERROR_CODE.AUTH.INVALID_USERNAME_OR_PASSWORD);

    const user = await objection.User.query().findOne({ phone });

    if (!user) {
      throw Error(ERROR_CODE.AUTH.INVALID_USER);
    }

    if (!user || !objection.User.validPassword(password, user.password)) {
      throw new Error(ERROR_CODE.AUTH.INVALID_USER);
    }

    await user.$query().patch({
      lastLoginAt: new Date()
    });

    return res.status(200).json(
      responseSuccess({
        message: 'Login success',
        data: {
          token: user.toJsonWithToken(),
          user
        }
      })
    );
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.post(
  '/register',
  validationMiddleware(signUpSchema),
  async (req: IRequest<any, any, ISignUp>, res: Response) => {
    try {
      const { fullName, phone, address, password } = req.body;

      const role = await objection.Role.query().findOne({ roleName: ROLE.USER });

      const query = await objection.User.query().insertAndFetch({
        fullName,
        phone,
        address,
        password: objection.User.generateHashPassword(password),
        roleId: role.id
      });

      if (!query) {
        throw Error(ERROR_CODE.AUTH.REGISTER_FAILED);
      }

      return res.status(200).json(
        responseSuccess({
          message: 'Register success',
          data: query
        })
      );
    } catch (error) {
      return res.status(400).json(responseError({ error }));
    }
  }
);

router.post('/forgot-password', async (req: IRequest<any, any, IForgotPassword>, res: Response) => {
  try {
    const { phone } = req.body;

    const user = await objection.User.query().findOne({ phone });

    if (!user) {
      throw Error(ERROR_CODE.AUTH.INVALID_USER);
    }

    const code = generateOTP();
    await objection.OTP.query().insert({ code, userId: user.id });

    const data: { phone: string; code?: number } = { phone };

    if (isDevelopment) {
      data.code = code;
    }

    return res.status(200).json(responseSuccess({ data }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.post('/verify-code', async (req: IRequest<any, any, IVerifyCode>, res: Response) => {
  try {
    const { phone, code } = req.body;

    const user = await objection.User.query().findOne({ phone });
    if (!user) {
      throw Error(ERROR_CODE.AUTH.INVALID_USER);
    }

    const otp = await objection.OTP.query().findOne({ userId: user.id, code });
    if (!otp) {
      throw Error(ERROR_CODE.AUTH.INVALID_OTP);
    }
    if (otp?.createdAt < dayjs().add(-5, 'minute').toDate()) {
      throw Error(ERROR_CODE.AUTH.OTP_EXPIRED);
    }

    return res.status(200).json(
      responseSuccess({
        message: 'Verify code success',
        data: {
          phone,
          code
        }
      })
    );
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

router.post('/reset-password', async (req: IRequest<any, any, IResetPassword>, res: Response) => {
  try {
    const { phone, newPassword, code } = req.body;

    const user = await objection.User.query().findOne({ phone });
    if (!user) {
      throw Error(ERROR_CODE.AUTH.INVALID_USER);
    }

    const otp = await objection.OTP.query().findOne({ userId: user.id, code });
    if (!otp) {
      throw Error(ERROR_CODE.AUTH.INVALID_OTP);
    }

    await user.$query().patch({ password: objection.User.generateHashPassword(newPassword) });
    await objection.OTP.query().where({ userId: user.id }).delete();

    return res.status(200).json(responseSuccess({ message: 'Reset password success' }));
  } catch (error) {
    return res.status(400).json(responseError({ error }));
  }
});

export default router;
