import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

interface BakeOptions {
  artId: string;
  colorHex: string;
  garmentType?: string;
  artworkSize?: string;
}

export class TextureBakingService {
  static async bakeTexture({ artId, colorHex, garmentType = 'tshirt-oversized', artworkSize = 'A3' }: BakeOptions): Promise<Buffer> {
    const baseColor = colorHex.startsWith('#') ? colorHex : `#${colorHex}`;
    const halftonesDir = path.resolve(process.cwd(), '../HALFTONES - RELIGIOSOS');

    // [SECURITY FIX: LFI Path Traversal] Impede barras, escapes ou pontuações de pulo de nível na raiz.
    if (/[/\\:]/.test(artId) || artId.includes("..")) {
      throw Object.assign(new Error("Tentativa de escalonamento de pasta barrada [LFI Path Traversal]"), { statusCode: 403 });
    }

    // Suporta fallback para o artId apenas (ex: art-01) se não passar o .png
    const filename = artId.endsWith('.png') ? artId : `${artId}.png`;
    const artPath = path.join(halftonesDir, artworkSize, filename);

    // 2º Camada Absoluta de Proteção da Regex.
    if (!artPath.startsWith(halftonesDir)) {
      throw Object.assign(new Error("Caminho inseguro violado."), { statusCode: 403 });
    }

    const assetsDir = path.resolve(__dirname, '../../assets/arts');

    if (!fs.existsSync(artPath)) {
      throw Object.assign(new Error(`Art not found: ${artId}`), { statusCode: 404 });
    }

    // [SECURITY & AESTHETIC AUDIT] Check if image has an alpha channel
    const artMetadata = await sharp(artPath).metadata();
    if (!artMetadata.hasAlpha) {
      throw Object.assign(new Error(`Security/Aesthetic Policy: Image ${artId} does not have a transparent background (Alpha channel missing). Solid backgrounds are rejected.`), { statusCode: 400 });
    }

    const UV_MAP_SIZE = 2048;
    const artSize = 700;
    const chestMarginTop = parseInt(process.env.CHEST_MARGIN_TOP || '600', 10);

    const resizedArtBuffer = await sharp(artPath)
      .resize({
        width: artSize,
        height: artSize,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    // Em vez de encadear do Sharp({}) direto o composite instavel,
    // a imagem base será finalizada rigidamente, e depois compositamos o buffer final.
    const finalImageBuffer = await sharp({
      create: {
        width: UV_MAP_SIZE,
        height: UV_MAP_SIZE,
        channels: 4,
        background: baseColor
      }
    })
      .composite([
        {
          input: resizedArtBuffer,
          top: chestMarginTop,
          left: Math.floor((UV_MAP_SIZE - artSize) / 2)
        }
      ])
      .webp({ quality: 90 })
      .toBuffer();

    // DEBUB SALVAMENTO RIGOROSO
    // Se ativarmos F5, o node grava pra sempre oq ele acaba de cuspir pra rede.
    // Assim nao existe dúvidas sobre o WebP da sua máquina.
    fs.writeFileSync(path.join(assetsDir, 'debug-last-baked.webp'), finalImageBuffer);

    return finalImageBuffer;
  }
}
