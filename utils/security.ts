
/**
 * SECURITY UTILITY - Monolith v2.5 Hardening
 * Ported from PrintPrice Pro corporate security standards
 */

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

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_SESSION_MOCKUPS = 24;
export const MAX_PREVIEWS_PER_BATCH = 5;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

export class SecurityError extends Error {
  code: string;

  constructor(message: string, code = 'SECURITY_ERROR') {
    super(message);
    this.name = 'SecurityError';
    this.code = code;
  }
}

export function getFileExtension(filename: string): string {
  const normalized = String(filename || '').trim().toLowerCase();
  const lastDot = normalized.lastIndexOf('.');
  return lastDot >= 0 ? normalized.slice(lastDot) : '';
}

export function isAllowedExtension(filename: string): boolean {
  return ALLOWED_IMAGE_EXTENSIONS.includes(
    getFileExtension(filename) as (typeof ALLOWED_IMAGE_EXTENSIONS)[number]
  );
}

export function isAllowedMimeType(mimeType: string): boolean {
  return ALLOWED_IMAGE_MIME_TYPES.includes(
    String(mimeType || '').toLowerCase() as AllowedImageMimeType
  );
}

export function sanitizeFileBasename(input: string): string {
  return String(input || 'cover')
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80) || 'cover';
}

export function createSafeAssetFilename(
  prefix: string,
  extension = '.png',
  perspective?: string
): string {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const safePrefix = sanitizeFileBasename(prefix).toUpperCase();
  const safePerspective = perspective
    ? `_${sanitizeFileBasename(perspective.toLowerCase()).toUpperCase()}`
    : '';

  return `${safePrefix}${safePerspective}_${ts}${extension.toUpperCase()}`;
}

export function bytesToReadable(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function readFileHeader(file: File, length = 16): Promise<Uint8Array> {
  const blob = file.slice(0, length);
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}

export function detectMimeTypeFromMagicBytes(bytes: Uint8Array): AllowedImageMimeType | null {
  if (bytes.length >= 3) {
    // JPEG: FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return 'image/jpeg';
    }
  }

  if (bytes.length >= 8) {
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    const isPng =
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a;

    if (isPng) return 'image/png';
  }

  if (bytes.length >= 12) {
    // WEBP: "RIFF....WEBP"
    const isRiff =
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46;

    const isWebp =
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50;

    if (isRiff && isWebp) return 'image/webp';
  }

  return null;
}

export async function safeDecodeImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };

      img.onerror = () => {
        reject(new SecurityError('CRITICAL_FAULT: INVALID_IMAGE_DECODE_FAILED', 'INVALID_IMAGE_DECODE'));
      };

      img.src = objectUrl;
    });

    return dimensions;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function stripImageMetadataWithCanvas(file: File): Promise<File> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () =>
        reject(new SecurityError('CRITICAL_FAULT: CANVAS_RE_ENCODING_FAILED', 'CANVAS_REENCODE_FAILED'));
      el.src = objectUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new SecurityError('CRITICAL_FAULT: SECURE_CANVAS_UNAVAILABLE', 'CANVAS_CONTEXT_UNAVAILABLE');
    }

    ctx.drawImage(img, 0, 0);

    const targetMime: AllowedImageMimeType =
      isAllowedMimeType(file.type) ? (file.type as AllowedImageMimeType) : 'image/png';

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (!result) {
            reject(new SecurityError('CRITICAL_FAULT: ASSET_EXPORT_FAILED', 'CANVAS_EXPORT_FAILED'));
            return;
          }
          resolve(result);
        },
        targetMime,
        targetMime === 'image/jpeg' || targetMime === 'image/webp' ? 0.92 : undefined
      );
    });

    const ext =
      targetMime === 'image/jpeg' ? '.jpg' :
      targetMime === 'image/png' ? '.png' :
      '.webp';

    return new File(
      [blob],
      `${sanitizeFileBasename(file.name.replace(/\.[^.]+$/, ''))}${ext}`,
      {
        type: targetMime,
        lastModified: Date.now(),
      }
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function ensureFinitePositiveNumber(
  value: number,
  fieldName: string,
  min: number,
  max: number
): void {
  if (!Number.isFinite(value)) {
    throw new SecurityError(`${fieldName} must be a valid number.`, 'INVALID_NUMERIC_INPUT');
  }
  if (value < min || value > max) {
    throw new SecurityError(
      `${fieldName} must be between ${min} and ${max}.`,
      'OUT_OF_RANGE_NUMERIC_INPUT'
    );
  }
}

export function escapeUserFacingText(input: string): string {
  return String(input || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
