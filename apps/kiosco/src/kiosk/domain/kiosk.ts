import { z } from 'zod';
import { ApiKey } from './api-key.value-object';
import { KioskIdentifier } from './kiosk-identifier.value-object';

// ─── Schema ───────────────────────────────────────────────────────────────────

const KioskSchema = z.object({
  id: z.string().min(1),
  tenantId: z.string().min(1),
  name: z.string().min(1).max(150),
  location: z.string().nullable(),
  campaignId: z.string().nullable(),
  isActive: z.boolean(),
  lastSeenAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type KioskProps = z.infer<typeof KioskSchema> & { apiKey: ApiKey; identifier: KioskIdentifier };

// ─── Aggregate ────────────────────────────────────────────────────────────────

export class Kiosk {
  private constructor(private props: KioskProps) {}

  static create(input: {
    id: string;
    tenantId: string;
    name: string;
    identifier: KioskIdentifier;
    apiKey: ApiKey;
    location?: string;
  }): Kiosk {
    const props = KioskSchema.parse({
      id: input.id,
      tenantId: input.tenantId,
      name: input.name,
      location: input.location ?? null,
      campaignId: null,
      isActive: true,
      lastSeenAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return new Kiosk({ ...props, apiKey: input.apiKey, identifier: input.identifier });
  }

  static reconstitute(input: z.infer<typeof KioskSchema> & { apiKey: string; identifier: string }): Kiosk {
    const props = KioskSchema.parse(input);
    return new Kiosk({
      ...props,
      apiKey: ApiKey.reconstitute(input.apiKey),
      identifier: KioskIdentifier.reconstitute(input.identifier),
    });
  }

  update(input: {
    name?: string;
    location?: string | null;
    campaignId?: string | null;
    isActive?: boolean;
  }): void {
    const updated = KioskSchema.parse({
      ...this.props,
      ...input,
      updatedAt: new Date(),
    });
    this.props = { ...updated, apiKey: this.props.apiKey, identifier: this.props.identifier };
  }

  get id() { return this.props.id; }
  get tenantId() { return this.props.tenantId; }
  get name() { return this.props.name; }
  get identifier() { return this.props.identifier; }
  get apiKey() { return this.props.apiKey; }
  get location() { return this.props.location; }
  get campaignId() { return this.props.campaignId; }
  get isActive() { return this.props.isActive; }
  get lastSeenAt() { return this.props.lastSeenAt; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
}
