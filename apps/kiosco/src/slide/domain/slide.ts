import { z } from 'zod';
import { SlideType } from '@kiosco/shared-kernel';

// ─── Content schemas por tipo ─────────────────────────────────────────────────

const BaseContentSchema = z.object({
  audio: z.string().optional(),
  backgroundImage: z.string().optional(),
});

const ContentSchemas: Record<SlideType, z.ZodTypeAny> = {
  [SlideType.TEXT]: BaseContentSchema.extend({
    text: z.string().min(1),
  }),
  [SlideType.VIDEO]: BaseContentSchema.extend({
    videoUrl: z.string().url(),
    text: z.string().optional(),
  }),
  [SlideType.IMAGE]: BaseContentSchema.extend({
    imageUrl: z.string().url(),
    text: z.string().optional(),
    isButtonPause: z.boolean().optional(),
  }),
  [SlideType.DOCUMENT]: BaseContentSchema.extend({
    documentUrl: z.string().url(),
    text: z.string().optional(),
  }),
  [SlideType.CUSTOM]: BaseContentSchema.extend({
    component: z.string().min(1),
  }),
};

// ─── Schema ───────────────────────────────────────────────────────────────────

const SlideSchema = z
  .object({
    id: z.string().min(1),
    activityId: z.string().min(1),
    type: z.nativeEnum(SlideType),
    order: z.number().int().min(0),
    content: z.record(z.unknown()),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .superRefine((data, ctx) => {
    const result = ContentSchemas[data.type].safeParse(data.content);
    if (!result.success) {
      result.error.errors.forEach((issue) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['content', ...issue.path],
          message: issue.message,
        });
      });
    }
  });

type SlideProps = z.infer<typeof SlideSchema>;

// ─── Aggregate ────────────────────────────────────────────────────────────────

export class Slide {
  private constructor(private props: SlideProps) {}

  static create(input: {
    id: string;
    activityId: string;
    type: SlideType;
    order?: number;
    content: Record<string, unknown>;
  }): Slide {
    const props = SlideSchema.parse({
      id: input.id,
      activityId: input.activityId,
      type: input.type,
      order: input.order ?? 0,
      content: input.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return new Slide(props);
  }

  static reconstitute(input: SlideProps): Slide {
    const props = SlideSchema.parse(input);
    return new Slide(props);
  }

  update(input: {
    type?: SlideType;
    order?: number;
    content?: Record<string, unknown>;
  }): void {
    const updated = SlideSchema.parse({
      ...this.props,
      ...input,
      updatedAt: new Date(),
    });
    this.props = updated;
  }

  get id() { return this.props.id; }
  get activityId() { return this.props.activityId; }
  get type() { return this.props.type; }
  get order() { return this.props.order; }
  get content() { return this.props.content; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
}
