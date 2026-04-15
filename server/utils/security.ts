
export class ApiError extends Error {
  statusCode: number;
  code: string;
  expose: boolean;

  constructor(
    message: string,
    code = 'INTERNAL_ERROR',
    statusCode = 500,
    expose = true
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.expose = expose;
  }
}

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
] as const;

export function sanitizeFileBasename(input: string): string {
  return String(input || 'asset')
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80) || 'asset';
}

export function createSafeAssetFilename(
  prefix: string,
  extension = '.png',
  perspective?: string
): string {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const safePrefix = sanitizeFileBasename(prefix);
  const safePerspective = perspective
    ? `_${sanitizeFileBasename(perspective)}`
    : '';

  return `${safePrefix}${safePerspective}_${ts}${extension}`;
}

export function getExtension(filename: string): string {
  const normalized = String(filename || '').toLowerCase().trim();
  const idx = normalized.lastIndexOf('.');
  return idx >= 0 ? normalized.slice(idx) : '';
}

export function ensureBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}
