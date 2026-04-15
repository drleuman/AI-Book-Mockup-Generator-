
// services/geminiService.ts

export interface MockupOptions {
  bindingType: 'paperback' | 'hardcover' | 'spiral';
  coverFinish: 'matte' | 'glossy';
  materialTexture: 'smooth' | 'textured' | 'linen';
  spineWidth: number;
  caseWrap?: boolean;
  backgroundColor: string;
  bookFormat: 'a4' | 'a5' | '6x9' | '8.5x11' | 'square';
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

function base64ToObjectUrl(base64: string, mimeType: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: mimeType });
  return URL.createObjectURL(blob);
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T | ApiErrorResponse;

  if (!response.ok) {
    const err = data as ApiErrorResponse;
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
  const formData = new FormData();
  formData.append('cover', coverImage);
  formData.append('perspective', perspective);
  formData.append('options', JSON.stringify(options));

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

  return {
    imageBase64: data.imageBase64,
    imageUrl: base64ToObjectUrl(data.imageBase64, data.mimeType),
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
  const formData = new FormData();
  formData.append('cover', coverImage);
  formData.append('perspectives', JSON.stringify(perspectives));
  formData.append('options', JSON.stringify(options));

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

  return data.results.map((item) => ({
    imageBase64: item.imageBase64,
    imageUrl: base64ToObjectUrl(item.imageBase64, item.mimeType),
    mimeType: item.mimeType,
    perspective: item.perspective,
  }));
}

export function revokeGeneratedMockupUrl(mockup: Pick<GeneratedMockup, 'imageUrl'>) {
  if (mockup?.imageUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(mockup.imageUrl);
  }
}