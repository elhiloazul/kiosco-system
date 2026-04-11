import { z } from 'zod';

const ActivityProgressSchema = z.object({
  name: z.string().default(''),
  lastSlideIndex: z.number().int().min(0),
  completed: z.boolean(),
  completedAt: z.string().optional(),
});

const UserSessionSchema = z.object({
  id: z.string().min(1),
  kioskId: z.string().min(1),
  name: z.string().min(1),
  age: z.string().min(1),
  neighborhood: z.string().min(1),
  activities: z.record(ActivityProgressSchema),
  startedAt: z.date(),
  endedAt: z.date().nullable(),
  createdAt: z.date(),
});

type UserSessionProps = z.infer<typeof UserSessionSchema>;
export type ActivityProgress = z.infer<typeof ActivityProgressSchema>;

export class UserSession {
  private constructor(private readonly props: UserSessionProps) {}

  static create(input: {
    id: string;
    kioskId: string;
    name: string;
    age: string;
    neighborhood: string;
    activities: Record<string, ActivityProgress>;
    startedAt: Date;
    endedAt?: Date;
  }): UserSession {
    const props = UserSessionSchema.parse({
      ...input,
      endedAt: input.endedAt ?? null,
      createdAt: new Date(),
    });
    return new UserSession(props);
  }

  static reconstitute(input: UserSessionProps): UserSession {
    return new UserSession(UserSessionSchema.parse(input));
  }

  get id() { return this.props.id; }
  get kioskId() { return this.props.kioskId; }
  get name() { return this.props.name; }
  get age() { return this.props.age; }
  get neighborhood() { return this.props.neighborhood; }
  get activities() { return this.props.activities; }
  get startedAt() { return this.props.startedAt; }
  get endedAt() { return this.props.endedAt; }
  get createdAt() { return this.props.createdAt; }
}
