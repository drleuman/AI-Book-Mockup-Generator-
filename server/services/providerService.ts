
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
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', // Using current stable model string
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
    for (const candidate of candidates) {
      const parts = candidate.content?.parts ?? [];
      for (const part of parts) {
        const inlineData = (part as any).inlineData;
        if (inlineData?.data) {
          return inlineData.data as string;
        }
      }
    }

    throw new ApiError(
      'The provider returned no usable image output.',
      'PROVIDER_EMPTY_OUTPUT',
      502
    );
  } catch (error) {
    console.error('PROVIDER_ERROR:', error);
    throw new ApiError(
      'The image generation provider is currently unavailable.',
      'PROVIDER_UNAVAILABLE',
      502
    );
  }
}
