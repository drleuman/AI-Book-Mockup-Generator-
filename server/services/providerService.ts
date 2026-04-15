
import { GoogleGenAI } from '@google/genai';
import { config } from '../config.js';
import { ApiError } from '../utils/security.js';

const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

type GenerateInput = {
  imageBuffer: Buffer;
  mimeType: string;
  prompt: string;
};

function bufferToInlineData(buffer: Buffer, mimeType: string) {
  return {
    inlineData: {
      mimeType,
      data: buffer.toString('base64'),
    },
  };
}

export async function generateMockupWithProvider({
  imageBuffer,
  mimeType,
  prompt,
}: GenerateInput): Promise<string> {
  try {
    // PRODUCTION SPECIFICATION: Using 'gemini-3.1-flash-image-preview'.
    // This is the dedicated model for image generation/editing workflows as of 2026.
    // Transitioning away from general-purpose 'gemini-3.1-flash'.
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            bufferToInlineData(imageBuffer, mimeType),
          ],
        },
      ],
    });

    const candidates = response?.candidates ?? [];
    if (candidates.length === 0) {
      throw new Error('PROVIDER_EMPTY_CANDIDATES');
    }

    for (const candidate of candidates) {
      const parts = candidate.content?.parts ?? [];
      for (const part of parts) {
        // Correctly handle the inlineData part containing the rendered mockup
        const inlineData = (part as any).inlineData;
        if (inlineData?.data) {
          return inlineData.data as string;
        }
      }
    }

    // Diagnostic logging for developers
    console.warn('[PROVIDER_MISSING_IMAGE] Response part type mismatch. Parts:', JSON.stringify(candidates[0].content?.parts));

    throw new ApiError(
      'The provider returned no usable image output. Verify source image quality and prompt constraints.',
      'PROVIDER_EMPTY_OUTPUT',
      502
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[PROVIDER_FAULT] ${new Date().toISOString()}:`, errorMessage);

    throw new ApiError(
      'The image generation provider is currently unavailable or the model request was rejected.',
      'PROVIDER_UNAVAILABLE',
      502
    );
  }
}
