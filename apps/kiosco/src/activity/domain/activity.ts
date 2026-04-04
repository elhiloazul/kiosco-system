import { z } from 'zod';

// ─── Schema ───────────────────────────────────────────────────────────────────

const MenuConfigSchema = z.object({
  audio: z.string().optional(),
  popoverDescription: z.string().optional(),
});

export type MenuConfig = z.infer<typeof MenuConfigSchema>;

const ActivitySchema = z.object({
  id: z.string().min(1),
  campaignId: z.string().min(1),
  name: z.string().min(1).max(100),
  order: z.number().int().min(0),
  isActive: z.boolean(),
  showInMenu: z.boolean(),
  menuOrder: z.number().int().min(0).nullable(),
  menuConfig: MenuConfigSchema.nullable(),
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
      showInMenu: false,
      menuOrder: null,
      menuConfig: null,
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
    showInMenu?: boolean;
    menuOrder?: number | null;
    menuConfig?: MenuConfig | null;
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
  get showInMenu() { return this.props.showInMenu; }
  get menuOrder() { return this.props.menuOrder; }
  get menuConfig() { return this.props.menuConfig; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
}
