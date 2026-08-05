import { Router } from 'express';
import { bakeTexture } from '../controllers/textureController';
import { listArts, getThumbnail } from '../controllers/artController';
import { bakingLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/bake-texture', bakingLimiter, bakeTexture);
router.get('/arts', listArts);
router.get('/arts/:size/:id/thumbnail', getThumbnail);

export default router;
