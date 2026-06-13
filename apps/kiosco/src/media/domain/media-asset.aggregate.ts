import { z } from 'zod';

const MediaAssetSchema = z.object({
  id: z.string().min(1),
  tenantId: z.string().min(1),
  name: z.string().min(1),
  url: z.string().url(),
  mimeType: z.string().min(1),
  size: z.number().int().positive(),
  createdAt: z.date(),
});

type MediaAssetProps = z.infer<typeof MediaAssetSchema>;

export class MediaAsset {
  private constructor(private readonly props: MediaAssetProps) {}

  static create(input: Omit<MediaAssetProps, 'createdAt'>): MediaAsset {
    const props = MediaAssetSchema.parse({ ...input, createdAt: new Date() });
    return new MediaAsset(props);
  }

  static reconstitute(input: MediaAssetProps): MediaAsset {
    return new MediaAsset(MediaAssetSchema.parse(input));
  }

  get id() { return this.props.id; }
  get tenantId() { return this.props.tenantId; }
  get name() { return this.props.name; }
  get url() { return this.props.url; }
  get mimeType() { return this.props.mimeType; }
  get size() { return this.props.size; }
  get createdAt() { return this.props.createdAt; }
}
