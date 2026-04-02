import { z } from 'zod';
import { Email } from '../../../shared/domain/email.value-object';

// ─── Schema ───────────────────────────────────────────────────────────────────

const AdminSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  passwordHash: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type AdminProps = z.infer<typeof AdminSchema> & { email: Email };

// ─── Aggregate ────────────────────────────────────────────────────────────────

export class Admin {
  private constructor(private props: AdminProps) {}

  static create(input: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
  }): Admin {
    const props = AdminSchema.parse({
      id: input.id,
      name: input.name,
      passwordHash: input.passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return new Admin({ ...props, email: Email.create(input.email) });
  }

  static reconstitute(input: z.infer<typeof AdminSchema> & { email: string }): Admin {
    const props = AdminSchema.parse(input);
    return new Admin({ ...props, email: Email.reconstitute(input.email) });
  }

  updateName(name: string): void {
    const updated = AdminSchema.parse({ ...this.props, name, updatedAt: new Date() });
    this.props = { ...updated, email: this.props.email };
  }

  updatePasswordHash(passwordHash: string): void {
    const updated = AdminSchema.parse({ ...this.props, passwordHash, updatedAt: new Date() });
    this.props = { ...updated, email: this.props.email };
  }

  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get email() { return this.props.email; }
  get passwordHash() { return this.props.passwordHash; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
}
