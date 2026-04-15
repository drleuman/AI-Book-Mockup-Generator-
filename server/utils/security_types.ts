
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export class SecurityError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = 'SECURITY_ERROR', status = 400) {
    super(message);
    this.name = 'SecurityError';
    this.code = code;
    this.status = status;
  }
}
