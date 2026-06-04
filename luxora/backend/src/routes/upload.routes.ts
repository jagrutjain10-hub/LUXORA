import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { upload, uploadImage, uploadImages } from '../controllers/upload.controller';

const router = Router();

router.post('/image', authenticate, upload.single('file'), uploadImage);
router.post('/images', authenticate, upload.array('files', 10), uploadImages);

export default router;
