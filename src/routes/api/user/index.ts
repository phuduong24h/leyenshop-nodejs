import { Router } from 'express';

import { requireUserLoginMiddleware, verifyUserMiddleware } from 'middlewares';

import auth from './auth';
import category from './category';
import categoryFeatured from './category-featured';
import config from './config';
import home from './home';
import me from './me';
import order from './order';
import product from './product';
import test from './test';

const router = Router();

router.use('/auth', auth);

router.use('/me', requireUserLoginMiddleware, me);

router.use('/', verifyUserMiddleware);
router.use('/config', config);
router.use('/home', home);
router.use('/category', category);
router.use('/category-featured', categoryFeatured);
router.use('/product', product);
router.use('/order', order);
router.use('/test', test);

export default router;
