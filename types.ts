export interface MockupOptions {
  bindingType: string;
  coverFinish: string;
  materialTexture: string;
  spineWidth: number;
  caseWrap: string;
  backgroundColor: string;
  bookFormat: string;
}

export interface GeneratedMockup {
  id: string;
  imageUrl: string;
  options: MockupOptions;
  isPreview: boolean;
  perspectiveLabel: string;
  perspectiveValue: string;
}
