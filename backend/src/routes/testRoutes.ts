import { Router } from 'express';
import { getTestMessage } from '../controllers/testController';

const router = Router();

router.get('/', getTestMessage);

export { router as testRoutes };
