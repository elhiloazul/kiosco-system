import { z } from 'zod';

// ─── Schema ───────────────────────────────────────────────────────────────────

const ActivitySchema = z.object({
  id: z.string().min(1),
  campaignId: z.string().min(1),
  name: z.string().min(1).max(100),
  order: z.number().int().min(0),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type ActivityProps = z.infer<typeof ActivitySchema>;

// ─── Aggregate ────────────────────────────────────────────────────────────────

export class Activity {
  private constructor(private props: ActivityProps) {}

  static create(input: {
    id: string;
    campaignId: string;
    name: string;
    order?: number;
  }): Activity {
    const props = ActivitySchema.parse({
      id: input.id,
      campaignId: input.campaignId,
      name: input.name,
      order: input.order ?? 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return new Activity(props);
  }

  static reconstitute(input: ActivityProps): Activity {
    const props = ActivitySchema.parse(input);
    return new Activity(props);
  }

  update(input: {
    name?: string;
    order?: number;
    isActive?: boolean;
  }): void {
    const updated = ActivitySchema.parse({
      ...this.props,
      ...input,
      updatedAt: new Date(),
    });
    this.props = updated;
  }

  get id() { return this.props.id; }
  get campaignId() { return this.props.campaignId; }
  get name() { return this.props.name; }
  get order() { return this.props.order; }
  get isActive() { return this.props.isActive; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
}
