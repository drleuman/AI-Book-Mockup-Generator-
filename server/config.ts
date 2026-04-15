
import dotenv from 'dotenv';

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function numberFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: numberFromEnv('SERVER_PORT', 8790),
  appOrigin: process.env.APP_ORIGIN || 'http://localhost:5174',

  geminiApiKey: required('GEMINI_API_KEY'),

  maxUploadBytes: numberFromEnv('MAX_UPLOAD_BYTES', 10 * 1024 * 1024),
  maxImageWidth: numberFromEnv('MAX_IMAGE_WIDTH', 12000),
  maxImageHeight: numberFromEnv('MAX_IMAGE_HEIGHT', 12000),
  minImageWidth: numberFromEnv('MIN_IMAGE_WIDTH', 200),
  minImageHeight: numberFromEnv('MIN_IMAGE_HEIGHT', 200),

  singleGenMax: numberFromEnv('RATE_LIMIT_SINGLE_MAX', 8),
  singleGenWindowMs: numberFromEnv('RATE_LIMIT_SINGLE_WINDOW_MS', 60_000),

  batchGenMax: numberFromEnv('RATE_LIMIT_BATCH_MAX', 3),
  batchGenWindowMs: numberFromEnv('RATE_LIMIT_BATCH_WINDOW_MS', 5 * 60_000),

  maxBatchPreviews: numberFromEnv('MAX_BATCH_PREVIEWS', 5),
};
