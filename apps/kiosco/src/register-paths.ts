import { register } from 'tsconfig-paths';
import { join } from 'path';

// Registers TypeScript path aliases for runtime resolution.
// Must be imported before any module that uses @tenant/*, @campaign/*, etc.
register({
  baseUrl: join(__dirname, '..'),
  paths: {
    '@kiosco/database': ['../../packages/database/dist'],
    '@kiosco/shared-kernel': ['../../packages/shared-kernel/dist'],
    '@tenant/*': ['src/tenant/*'],
    '@campaign/*': ['src/campaign/*'],
    '@activity/*': ['src/activity/*'],
    '@slide/*': ['src/slide/*'],
    '@kiosk/*': ['src/kiosk/*'],
    '@security/*': ['src/security/*'],
    '@user-session/*': ['src/user-session/*'],
  },
});
