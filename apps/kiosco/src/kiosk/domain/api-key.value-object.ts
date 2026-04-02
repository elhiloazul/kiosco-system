import { createId } from '@paralleldrive/cuid2';

export type ApiKeyEnv = 'test' | 'prod';

export class ApiKey {
  private constructor(readonly value: string) {}

  static generate(env: ApiKeyEnv): ApiKey {
    return new ApiKey(`api_${env}_${createId()}`);
  }

  static reconstitute(value: string): ApiKey {
    if (!/^api_(test|prod)_\w+$/.test(value)) {
      throw new Error(`Invalid API key format: ${value}`);
    }
    return new ApiKey(value);
  }

  toString(): string {
    return this.value;
  }
}
