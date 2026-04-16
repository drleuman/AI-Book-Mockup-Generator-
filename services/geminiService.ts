
// services/geminiService.ts
import { normalizePayload, normalizePerspective } from '../utils/normalization';

export interface MockupOptions {
  bindingType: string;
  coverFinish: string;
  materialTexture: string;
  spineWidth: number;
  caseWrap?: boolean | string;
  backgroundColor: string;
  bookFormat: string;
}

export interface GeneratedMockup {
  imageUrl: string;
  imageBase64?: string;
  mimeType: string;
  perspective: string;
}

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

/**
 * Validates that the provided image data is a non-empty string.
 * Prevents object-to-string coercion [object Object] in data URLs.
 */
function ensureBase64String(data: unknown): string {
  if (typeof data !== 'string' || data.length === 0) {
    console.error('[CONTRACT_VIOLATION] Expected base64 string, received:', typeof data, data);
    throw new Error('SYSTEM_FAULT: INVALID_IMAGE_PAYLOAD');
  }
  return data;
}

function base64ToObjectUrl(base64: string, mimeType: string): string {
  const verifiedBase64 = ensureBase64String(base64);

  try {
    const binary = atob(verifiedBase64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('[DECODE_FAULT] Failed to process base64 string:', err);
    throw new Error('SYSTEM_FAULT: ASSET_DECODE_FAILED');
  }
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  let data: any;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else if (!response.ok) {
    const text = await response.text();
    console.error(`[BFF_REJECTION] ${response.status}: Non-JSON error response.`, text.substring(0, 200));
    throw new Error(`Server Error (${response.status}): The request timed out or the server returned an invalid response.`);
  } else {
    throw new Error('Unexpected response format from server.');
  }

  if (!response.ok) {
    const err = data as ApiErrorResponse;
    console.error(`[BFF_REJECTION] ${response.status}:`, err.code, err.message);
    throw new Error(err.message || 'Request failed.');
  }

  return data as T;
}

export async function validateUpload(coverImage: File) {
  const formData = new FormData();
  formData.append('cover', coverImage);

  const response = await fetch('/api/mockups/validate-upload', {
    method: 'POST',
    body: formData,
  });

  return parseApiResponse<{
    ok: true;
    mimeType: string;
    width: number;
    height: number;
    size: number;
  }>(response);
}

export async function generateBookMockup(
  coverImage: File,
  options: MockupOptions,
  perspective: string
): Promise<GeneratedMockup> {
  const normalizedOptions = normalizePayload(options);
  const normalizedPerspective = normalizePerspective(perspective);

  const formData = new FormData();
  formData.append('cover', coverImage);
  formData.append('perspective', normalizedPerspective);
  formData.append('options', JSON.stringify(normalizedOptions));

  const response = await fetch('/api/mockups/generate', {
    method: 'POST',
    body: formData,
  });

  const data = await parseApiResponse<{
    ok: true;
    imageBase64: string;
    mimeType: string;
    perspective: string;
  }>(response);

  const imageBase64 = ensureBase64String(data.imageBase64);

  return {
    imageBase64,
    imageUrl: base64ToObjectUrl(imageBase64, data.mimeType),
    mimeType: data.mimeType,
    perspective: data.perspective,
  };
}

export async function generateBookPreview(
  coverImage: File,
  options: MockupOptions,
  perspective: string
): Promise<GeneratedMockup> {
  return generateBookMockup(coverImage, options, perspective);
}

export async function generateBookPreviewBatch(
  coverImage: File,
  options: MockupOptions,
  perspectives: string[]
): Promise<GeneratedMockup[]> {
  const normalizedOptions = normalizePayload(options);
  const normalizedPerspectives = perspectives.map(normalizePerspective);

  const formData = new FormData();
  formData.append('cover', coverImage);
  formData.append('perspectives', JSON.stringify(normalizedPerspectives));
  formData.append('options', JSON.stringify(normalizedOptions));

  const response = await fetch('/api/mockups/generate-batch', {
    method: 'POST',
    body: formData,
  });

  const data = await parseApiResponse<{
    ok: true;
    results: Array<{
      imageBase64: string;
      mimeType: string;
      perspective: string;
    }>;
  }>(response);

  return data.results.map((item) => {
    const imageBase64 = ensureBase64String(item.imageBase64);
    return {
      imageBase64,
      imageUrl: base64ToObjectUrl(imageBase64, item.mimeType),
      mimeType: item.mimeType,
      perspective: item.perspective,
    };
  });
}

export function revokeGeneratedMockupUrl(mockup: Pick<GeneratedMockup, 'imageUrl'>) {
  if (mockup?.imageUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(mockup.imageUrl);
  }
}