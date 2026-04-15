
import type { MockupOptions } from '../types';

/**
 * Normalizes frontend-specific option values to backend-compatible enums.
 * This ensures the high-fidelity BFF remains strict without compromising the rich frontend UX.
 */

export const normalizePerspective = (frontendValue: string): string => {
  const mapping: Record<string, string> = {
    'slightly angled 3/4 view': 'angled',
    'front view, straight-on': 'front',
    'isometric view from above': 'standing',
    'view of the book standing upright, looking directly at the spine so that only the spine is visible.': 'standing',
    'close-up detail shot on the spine and corner': 'front',
    'front': 'front',
    'angled': 'angled',
    'stacked': 'stacked',
    'standing': 'standing',
    'flatlay': 'flatlay'
  };

  return mapping[frontendValue] || 'front';
};

export const normalizeBookFormat = (frontendValue: string): string => {
  const mapping: Record<string, string> = {
    'vertical': 'a4',
    'horizontal': '6x9',
    'square': 'square',
    'a4': 'a4',
    'a5': 'a5',
    '6x9': '6x9',
    '8.5x11': '8.5x11'
  };

  return mapping[frontendValue] || 'a4';
};

export const normalizeBindingType = (frontendValue: string): string => {
  const mapping: Record<string, string> = {
    'perfect bound': 'paperback',
    'saddle stitch': 'paperback',
    'hardcover': 'hardcover',
    'wire-o': 'spiral',
    'spiral': 'spiral',
    'section sewn': 'paperback'
  };

  return mapping[frontendValue] || 'paperback';
};

export const normalizeCoverFinish = (frontendValue: string): string => {
  const mapping: Record<string, string> = {
    'matte': 'matte',
    'glossy': 'glossy',
    'satin': 'matte',
    'uncoated': 'matte'
  };

  return mapping[frontendValue] || 'matte';
};

export const normalizeMaterialTexture = (frontendValue: string): string => {
  const mapping: Record<string, string> = {
    'smooth': 'smooth',
    'linen': 'linen',
    'cloth': 'textured',
    'leatherette': 'textured'
  };

  return mapping[frontendValue] || 'smooth';
};

export const normalizePayload = (options: MockupOptions) => {
  return {
    ...options,
    bindingType: normalizeBindingType(options.bindingType),
    coverFinish: normalizeCoverFinish(options.coverFinish),
    materialTexture: normalizeMaterialTexture(options.materialTexture),
    bookFormat: normalizeBookFormat(options.bookFormat),
    // Ensure caseWrap is boolean and spineWidth is a number
    caseWrap: Boolean(options.caseWrap),
    spineWidth: Number(options.spineWidth)
  };
};
