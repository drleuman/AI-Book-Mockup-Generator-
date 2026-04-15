
import express from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { ApiError } from '../utils/security.js';
import { validateAndSanitizeImageUpload } from '../utils/fileValidation.js';
import { generateMockupWithProvider } from '../services/providerService.js';
import { generateBatchSchema, generateSchema } from '../validators/mockupSchemas.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.maxUploadBytes,
    files: 1,
  },
});

const singleLimiter = rateLimit({
  windowMs: config.singleGenWindowMs,
  max: config.singleGenMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 'RATE_LIMITED',
    message: 'Too many generation requests. Please try again later.',
  },
});

const batchLimiter = rateLimit({
  windowMs: config.batchGenWindowMs,
  max: config.batchGenMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 'RATE_LIMITED',
    message: 'Too many batch generation requests. Please try again later.',
  },
});

function buildPrompt(options: Record<string, unknown>, perspective: string) {
  return [
    'Generate a realistic, premium book mockup.',
    `Perspective: ${perspective}.`,
    `Binding type: ${options.bindingType}.`,
    `Cover finish: ${options.coverFinish}.`,
    `Material texture: ${options.materialTexture}.`,
    `Spine width: ${options.spineWidth}mm.`,
    `Case wrap: ${options.caseWrap ? 'yes' : 'no'}.`,
    `Background color: ${options.backgroundColor}.`,
    `Book format: ${options.bookFormat}.`,
    'Keep the uploaded cover artwork accurate and undistorted.',
    'Return only the final mockup image.',
  ].join(' ');
}

router.post(
  '/validate-upload',
  upload.single('cover'),
  async (req, res, next) => {
    try {
      const validated = await validateAndSanitizeImageUpload(req.file as Express.Multer.File);

      return res.json({
        ok: true,
        mimeType: validated.mimeType,
        width: validated.width,
        height: validated.height,
        size: validated.size,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/generate',
  singleLimiter,
  upload.single('cover'),
  async (req, res, next) => {
    try {
      const validated = await validateAndSanitizeImageUpload(req.file as Express.Multer.File);

      const parsed = generateSchema.parse({
        perspective: req.body.perspective,
        options: JSON.parse(req.body.options),
      });

      const prompt = buildPrompt(parsed.options, parsed.perspective);

      const imageBase64 = await generateMockupWithProvider({
        imageBuffer: validated.sanitizedBuffer,
        mimeType: validated.mimeType,
        prompt,
      });

      logger.info('Single mockup generated', {
        ip: req.ip,
        perspective: parsed.perspective,
      });

      return res.json({
        ok: true,
        imageBase64,
        mimeType: 'image/png',
        perspective: parsed.perspective,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/generate-batch',
  batchLimiter,
  upload.single('cover'),
  async (req, res, next) => {
    try {
      const validated = await validateAndSanitizeImageUpload(req.file as Express.Multer.File);

      const parsed = generateBatchSchema.parse({
        perspectives: JSON.parse(req.body.perspectives),
        options: JSON.parse(req.body.options),
      });

      if (parsed.perspectives.length > config.maxBatchPreviews) {
        throw new ApiError(
          `Batch previews are limited to ${config.maxBatchPreviews}.`,
          'BATCH_LIMIT_EXCEEDED',
          400
        );
      }

      const results = [];
      for (const perspective of parsed.perspectives) {
        const prompt = buildPrompt(parsed.options, perspective);

        const imageBase64 = await generateMockupWithProvider({
          imageBuffer: validated.sanitizedBuffer,
          mimeType: validated.mimeType,
          prompt,
        });

        results.push({
          perspective,
          imageBase64,
          mimeType: 'image/png',
        });
      }

      logger.info('Batch mockups generated', {
        ip: req.ip,
        count: results.length,
      });

      return res.json({
        ok: true,
        results,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
