import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import path from 'path';
import fs from 'fs';

// Use disk storage for local dev, replace with Cloudinary in prod
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 }, // 10MB per file, max 10 files
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|avif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext) && allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Only image files (JPEG, PNG, WebP) are allowed.', 400) as any);
    }
  },
});

async function processAndSaveImage(buffer: Buffer, filename: string): Promise<string> {
  // In production, upload to Cloudinary:
  // const result = await cloudinary.uploader.upload_stream(...)
  // For now, save locally and return path

  const outputDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, filename);

  await sharp(buffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(outputPath);

  return `${env.BACKEND_URL}/uploads/${filename}`;
}

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new AppError('No image file provided.', 400);

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
    const url = await processAndSaveImage(req.file.buffer, filename);

    res.json({ success: true, data: { url, filename } });
  } catch (err) {
    next(err);
  }
}

export async function uploadImages(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.files?.length) throw new AppError('No image files provided.', 400);

    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();

    const urls = await Promise.all(
      files.map(async (file) => {
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
        return processAndSaveImage(file.buffer, filename);
      })
    );

    res.json({ success: true, data: { urls } });
  } catch (err) {
    next(err);
  }
}
