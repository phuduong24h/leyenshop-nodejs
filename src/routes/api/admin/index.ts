import { Router } from 'express';

import { verifyAdminMiddleware } from 'middlewares';

import auth from './auth';
import banner from './banner';
import category from './category';
import categoryFeatured from './category-featured';
import color from './color';
import order from './order';
import product from './product';
import productFeatured from './product-featured';
import promotion from './promotion';
import role from './role';
import size from './size';
import theme from './theme';
import upload from './upload';
import user from './user';
import web from './web';

const router = Router();

router.use('/auth', auth);

router.use('/', verifyAdminMiddleware);
router.use('/color', color);
router.use('/size', size);
router.use('/category', category);
router.use('/category-featured', categoryFeatured);
router.use('/promotion', promotion);
router.use('/product', product);
router.use('/product-featured', productFeatured);
router.use('/upload', upload);
router.use('/order', order);
router.use('/user', user);
router.use('/web', web);
router.use('/theme', theme);
router.use('/banner', banner);
router.use('/role', role);

export default router;
