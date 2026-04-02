import { z } from 'zod';

export class Email {
  private constructor(readonly value: string) {}

  static create(value: string): Email {
    const parsed = z.string().email().parse(value);
    return new Email(parsed.toLowerCase());
  }

  static reconstitute(value: string): Email {
    return new Email(value);
  }

  toString(): string {
    return this.value;
  }
}
