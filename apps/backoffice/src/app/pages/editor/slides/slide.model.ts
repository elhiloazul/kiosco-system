export enum SlideType {
  VIDEO    = 'video',
  IMAGE    = 'image',
  TEXT     = 'text',
  DOCUMENT = 'document',
  CUSTOM   = 'custom',
}

export const SLIDE_TYPE_LABELS: Record<SlideType, string> = {
  [SlideType.VIDEO]:    'Video',
  [SlideType.IMAGE]:    'Imagen',
  [SlideType.TEXT]:     'Texto',
  [SlideType.DOCUMENT]: 'Documento',
  [SlideType.CUSTOM]:   'Personalizado',
};

// ─── Request interfaces ───────────────────────────────────────────────────────

export interface CreateSlideRequest {
  name: string;
  type: SlideType;
  content?: Record<string, unknown>;
}

export interface UpdateSlideRequest {
  name?: string;
  type?: SlideType;
  order?: number;
  content?: Record<string, unknown>;
}

// ─── Domain models ────────────────────────────────────────────────────────────

export interface Slide {
  id: string;
  activityId: string;
  type: SlideType;
  name: string;
  order: number;
  content: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
