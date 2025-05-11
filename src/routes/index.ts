import { Router } from 'express';

import { checkPaginationMiddleware } from 'middlewares';

import api from './api';

const router = Router();

router.use('/api/v1', checkPaginationMiddleware, api);

export default router;
