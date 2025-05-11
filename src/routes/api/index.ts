import { Router } from 'express';

import admin from './admin';
import user from './user';

const router = Router();

router.use('/', user);
router.use('/admin', admin);

export default router;
