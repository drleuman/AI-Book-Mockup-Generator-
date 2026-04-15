
import { GoogleGenAI } from '@google/genai';
import { config } from '../config.js';
import { ApiError } from '../utils/security.js';
import { logger } from '../utils/logger.js';

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
        const inlineData = (part as any).inlineData;
        
        if (inlineData) {
          logger.info('Provider part found', {
            hasInlineData: true,
            dataType: typeof inlineData.data,
            mimeType: inlineData.mimeType
          });

          if (typeof inlineData.data === 'string' && inlineData.data.length > 0) {
            return inlineData.data;
          }
        }
      }
    }

    // Diagnostic logging for developers
    logger.error('[PROVIDER_DATA_MISMATCH] No valid base64 string found in parts', {
      partsCount: candidates[0].content?.parts?.length,
      firstPartKeys: candidates[0].content?.parts?.[0] ? Object.keys(candidates[0].content.parts[0]) : 'none'
    });

    throw new ApiError(
      'The provider returned no usable image output. Verify source image quality.',
      'PROVIDER_EMPTY_OUTPUT',
      502
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('PROVIDER_FAULT', { error: errorMessage });

    throw new ApiError(
      'The image generation provider is currently unavailable or the request format is incompatible.',
      'PROVIDER_UNAVAILABLE',
      502
    );
  }
}
