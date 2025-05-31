import { Router } from 'express';

import { getAllMarkers } from '../controllers/mapController';

const router = Router();

router.get('/all', getAllMarkers);

export { router as mapRoutes };
