
import { z } from 'zod';

export const bindingTypeSchema = z.enum([
  'paperback',
  'hardcover',
  'spiral',
]);

export const coverFinishSchema = z.enum([
  'matte',
  'glossy',
]);

export const materialTextureSchema = z.enum([
  'smooth',
  'textured',
  'linen',
]);

export const bookFormatSchema = z.enum([
  'a4',
  'a5',
  '6x9',
  '8.5x11',
  'square',
]);

export const perspectiveSchema = z.enum([
  'front',
  'angled',
  'stacked',
  'standing',
  'flatlay',
]);

export const mockupOptionsSchema = z.object({
  bindingType: bindingTypeSchema,
  coverFinish: coverFinishSchema,
  materialTexture: materialTextureSchema,
  spineWidth: z.number().min(1).max(150),
  caseWrap: z.boolean().optional().default(false),
  backgroundColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
  bookFormat: bookFormatSchema,
});

export const generateSchema = z.object({
  perspective: perspectiveSchema,
  options: mockupOptionsSchema,
});

export const generateBatchSchema = z.object({
  perspectives: z.array(perspectiveSchema).min(1).max(5),
  options: mockupOptionsSchema,
});

export type GeneratePayload = z.infer<typeof generateSchema>;
export type GenerateBatchPayload = z.infer<typeof generateBatchSchema>;
