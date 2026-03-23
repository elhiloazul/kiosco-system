import { z } from 'zod';

// ─── Schema ───────────────────────────────────────────────────────────────────

const TenantSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(100),
  logoUrl: z.string().url().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type TenantProps = z.infer<typeof TenantSchema>;

// ─── Aggregate ────────────────────────────────────────────────────────────────

export class Tenant {
  private constructor(private readonly props: TenantProps) {}

  static create(input: { id: string; name: string; logoUrl?: string }): Tenant {
    const props = TenantSchema.parse({
      id: input.id,
      name: input.name,
      logoUrl: input.logoUrl ?? null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return new Tenant(props);
  }

  static reconstitute(input: TenantProps): Tenant {
    const props = TenantSchema.parse(input);
    return new Tenant(props);
  }

  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get logoUrl() { return this.props.logoUrl; }
  get isActive() { return this.props.isActive; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
}
