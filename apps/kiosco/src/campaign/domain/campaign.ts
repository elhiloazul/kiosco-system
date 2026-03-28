import { z } from 'zod';

// ─── Schema ───────────────────────────────────────────────────────────────────

const CampaignSchema = z.object({
  id: z.string().min(1),
  tenantId: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().nullable(),
  isActive: z.boolean(),
  startsAt: z.date().nullable(),
  endsAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type CampaignProps = z.infer<typeof CampaignSchema>;

// ─── Aggregate ────────────────────────────────────────────────────────────────

export class Campaign {
  private constructor(private props: CampaignProps) {}

  static create(input: {
    id: string;
    tenantId: string;
    name: string;
    description?: string;
    startsAt?: Date;
    endsAt?: Date;
  }): Campaign {
    const now = new Date()
    const props = CampaignSchema.parse({
      id: input.id,
      tenantId: input.tenantId,
      name: input.name,
      description: input.description ?? null,
      isActive: true,
      startsAt: input.startsAt ?? null,
      endsAt: input.endsAt ?? null,
      createdAt: now ,
      updatedAt: now,
    });
    return new Campaign(props);
  }

  static reconstitute(input: CampaignProps): Campaign {
    const props = CampaignSchema.parse(input);
    return new Campaign(props);
  }

  update(input: {
    name?: string;
    description?: string | null;
    isActive?: boolean;
    startsAt?: Date | null;
    endsAt?: Date | null;
  }): void {
    const updated = CampaignSchema.parse({
      ...this.props,
      ...input,
      updatedAt: new Date(),
    });
    this.props = updated;
  }

  get id() { return this.props.id; }
  get tenantId() { return this.props.tenantId; }
  get name() { return this.props.name; }
  get description() { return this.props.description; }
  get isActive() { return this.props.isActive; }
  get startsAt() { return this.props.startsAt; }
  get endsAt() { return this.props.endsAt; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
}