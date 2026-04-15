
import sharp from 'sharp';
import { config } from '../config';
import { ApiError, ALLOWED_IMAGE_EXTENSIONS, ALLOWED_IMAGE_MIME_TYPES, getExtension } from './security';

export type ValidatedImage = {
  sanitizedBuffer: Buffer;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  width: number;
  height: number;
  size: number;
};

const PNG_SIG = '89504e470d0a1a0a';
const JPG_SIG = 'ffd8ff';
const RIFF_SIG = '52494646';
const WEBP_SIG = '57454250';

function detectMimeFromMagicBytes(buffer: Buffer): ValidatedImage['mimeType'] | null {
  const hex = buffer.subarray(0, 16).toString('hex');

  if (hex.startsWith(JPG_SIG)) return 'image/jpeg';
  if (hex.startsWith(PNG_SIG)) return 'image/png';

  const riff = buffer.subarray(0, 4).toString('hex');
  const webp = buffer.subarray(8, 12).toString('hex');
  if (riff === RIFF_SIG && webp === WEBP_SIG) return 'image/webp';

  return null;
}

export async function validateAndSanitizeImageUpload(
  file: Express.Multer.File
): Promise<ValidatedImage> {
  if (!file) {
    throw new ApiError('No file uploaded.', 'MISSING_FILE', 400);
  }

  const ext = getExtension(file.originalname);
  if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext as any)) {
    throw new ApiError(
      'Unsupported file extension. Allowed: JPG, PNG, WEBP.',
      'INVALID_UPLOAD_EXTENSION',
      400
    );
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype as any)) {
    throw new ApiError(
      'Unsupported MIME type. Allowed: image/jpeg, image/png, image/webp.',
      'INVALID_UPLOAD_MIME',
      400
    );
  }

  if (!file.buffer || file.buffer.length === 0) {
    throw new ApiError('Uploaded file is empty.', 'EMPTY_FILE', 400);
  }

  if (file.size > config.maxUploadBytes) {
    throw new ApiError(
      `File exceeds the maximum allowed size of ${config.maxUploadBytes} bytes.`,
      'FILE_TOO_LARGE',
      413
    );
  }

  const detectedMime = detectMimeFromMagicBytes(file.buffer);
  if (!detectedMime) {
    throw new ApiError(
      'The uploaded file signature is invalid.',
      'INVALID_IMAGE_SIGNATURE',
      400
    );
  }

  if (detectedMime !== file.mimetype) {
    throw new ApiError(
      'The uploaded file content does not match its declared MIME type.',
      'MIME_SIGNATURE_MISMATCH',
      400
    );
  }

  let metadata;
  try {
    metadata = await sharp(file.buffer, { failOn: 'error' }).metadata();
  } catch {
    throw new ApiError(
      'The uploaded file is not a decodable image.',
      'INVALID_IMAGE_DECODE',
      400
    );
  }

  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  if (width < config.minImageWidth || height < config.minImageHeight) {
    throw new ApiError(
      'Image dimensions are below the minimum allowed size.',
      'IMAGE_TOO_SMALL',
      400
    );
  }

  if (width > config.maxImageWidth || height > config.maxImageHeight) {
    throw new ApiError(
      'Image dimensions exceed the maximum allowed size.',
      'IMAGE_TOO_LARGE',
      400
    );
  }

  let sanitizedBuffer: Buffer;
  if (detectedMime === 'image/jpeg') {
    sanitizedBuffer = await sharp(file.buffer).rotate().jpeg({ quality: 92 }).toBuffer();
  } else if (detectedMime === 'image/png') {
    sanitizedBuffer = await sharp(file.buffer).rotate().png().toBuffer();
  } else {
    sanitizedBuffer = await sharp(file.buffer).rotate().webp({ quality: 92 }).toBuffer();
  }

  return {
    sanitizedBuffer,
    mimeType: detectedMime,
    width,
    height,
    size: sanitizedBuffer.length,
  };
}
