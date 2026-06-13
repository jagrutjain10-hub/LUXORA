import { Router } from 'express';
import multer from 'multer';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { uploadImage, uploadMultipleImages, deleteImage } from '../controllers/upload.controller';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.post('/single', authenticate, requireAdmin, upload.single('image'), uploadImage);
router.post('/multiple', authenticate, requireAdmin, upload.array('images', 10), uploadMultipleImages);
router.delete('/', authenticate, requireAdmin, deleteImage);

export default router;