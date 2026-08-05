import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { TextureBakingService } from '../services/textureBakingService';

const bakeSchema = z.object({
  artId: z.string().min(1),
  colorHex: z.string().regex(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex color'),
  garmentType: z.string().optional(),
  artworkSize: z.string().optional()
});

export const bakeTexture = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { artId, colorHex, garmentType, artworkSize } = bakeSchema.parse(req.body);

    const webpBuffer = await TextureBakingService.bakeTexture({
       artId,
       colorHex,
       garmentType,
       artworkSize
    });

    res.set('Content-Type', 'image/webp');
    res.set('Cache-Control', 'public, max-age=60');

    res.send(webpBuffer);

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: err.issues
      });
    }
    next(err);
  }
};
