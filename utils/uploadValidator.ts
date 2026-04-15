
import {
  MAX_UPLOAD_BYTES,
  SecurityError,
  bytesToReadable,
  detectMimeTypeFromMagicBytes,
  isAllowedExtension,
  isAllowedMimeType,
  readFileHeader,
  safeDecodeImageDimensions,
  stripImageMetadataWithCanvas,
} from './security';

export interface ValidatedImageResult {
  sanitizedFile: File;
  detectedMimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  width: number;
  height: number;
  size: number;
}

export async function validateAndSanitizeUpload(file: File): Promise<ValidatedImageResult> {
  if (!(file instanceof File)) {
    throw new SecurityError('CRITICAL_FAULT: INVALID_FILE_OBJECT', 'INVALID_FILE_OBJECT');
  }

  if (!file.name) {
    throw new SecurityError('CRITICAL_FAULT: MISSING_FILENAME', 'MISSING_FILENAME');
  }

  if (!isAllowedExtension(file.name)) {
    throw new SecurityError(
      'CRITICAL_FAULT: UNSUPPORTED_EXTENSION. USE JPG, PNG, OR WEBP.',
      'UNSUPPORTED_EXTENSION'
    );
  }

  if (!isAllowedMimeType(file.type)) {
    throw new SecurityError(
      'CRITICAL_FAULT: UNSUPPORTED_MIME_TYPE. USE JPG, PNG, OR WEBP.',
      'UNSUPPORTED_MIME_TYPE'
    );
  }

  if (file.size <= 0) {
    throw new SecurityError('CRITICAL_FAULT: EMPTY_ASSET_DETECTED', 'EMPTY_FILE');
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new SecurityError(
       `CRITICAL_FAULT: ASSET_SIZE_LIMIT_EXCEEDED (MAX ${bytesToReadable(MAX_UPLOAD_BYTES)})`,
      'FILE_TOO_LARGE'
    );
  }

  const header = await readFileHeader(file, 16);
  const detectedMimeType = detectMimeTypeFromMagicBytes(header);

  if (!detectedMimeType) {
    throw new SecurityError(
      'CRITICAL_FAULT: INVALID_MAGIC_BYTES_SIGNATURE',
      'INVALID_MAGIC_BYTES'
    );
  }

  if (detectedMimeType !== file.type) {
    throw new SecurityError(
      'CRITICAL_FAULT: MIME_SIGNATURE_MISMATCH_DETECTED',
      'MIME_SIGNATURE_MISMATCH'
    );
  }

  const { width, height } = await safeDecodeImageDimensions(file);

  if (width < 200 || height < 200) {
    throw new SecurityError(
      'CRITICAL_FAULT: INS_DIMENSIONS (MIN 200x200PX)',
      'IMAGE_TOO_SMALL'
    );
  }

  if (width > 12000 || height > 12000) {
    throw new SecurityError(
      'CRITICAL_FAULT: DIMENSIONS_SCALE_OUT_OF_BOUNDS',
      'IMAGE_DIMENSIONS_TOO_LARGE'
    );
  }

  const sanitizedFile = await stripImageMetadataWithCanvas(file);

  return {
    sanitizedFile,
    detectedMimeType,
    width,
    height,
    size: sanitizedFile.size,
  };
}
