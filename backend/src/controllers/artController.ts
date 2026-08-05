import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ARTS_DIR = path.resolve(process.cwd(), '../HALFTONES - RELIGIOSOS');

export const listArts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validSizes = ['A2', 'A3', 'A4'];
    const arts: { id: string, size: string, name: string }[] = [];

    for (const size of validSizes) {
      const sizeDir = path.join(ARTS_DIR, size);
      if (fs.existsSync(sizeDir)) {
        const files = fs.readdirSync(sizeDir);
        for (const file of files) {
          if (file.toLowerCase().endsWith('.png')) {
            arts.push({
              id: file,
              size: size,
              name: file.replace('.png', '')
            });
          }
        }
      }
    }

    res.json({ arts });
  } catch (err) {
    next(err);
  }
};

export const getThumbnail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { size, id } = req.params as { size: string; id: string };

    // Validar entradas para evitar path traversal
    if (!['A2', 'A3', 'A4'].includes(size) || id.includes('/') || id.includes('\\')) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    const artPath = path.join(ARTS_DIR, size, id);

    if (!fs.existsSync(artPath)) {
      return res.status(404).json({ error: 'Art not found' });
    }

    const thumbnailBuffer = await sharp(artPath)
      .resize({ width: 150, height: 150, fit: 'inside' })
      .webp({ quality: 60 })
      .toBuffer();

    res.set('Content-Type', 'image/webp');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(thumbnailBuffer);
  } catch (err) {
    next(err);
  }
};
