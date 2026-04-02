import 'dotenv/config';
import { PrismaClient } from '@kiosco/database';
import { createId } from '@paralleldrive/cuid2';
import * as bcrypt from 'bcrypt';

function resolveConfig() {
  const { SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } = process.env;
  const missing: string[] = [];

  if (!SEED_ADMIN_NAME) missing.push('SEED_ADMIN_NAME');
  if (!SEED_ADMIN_EMAIL) missing.push('SEED_ADMIN_EMAIL');
  if (!SEED_ADMIN_PASSWORD) missing.push('SEED_ADMIN_PASSWORD');

  if (missing.length > 0) {
    console.error(`✗ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  return {
    name: SEED_ADMIN_NAME as string,
    email: SEED_ADMIN_EMAIL as string,
    password: SEED_ADMIN_PASSWORD as string,
  };
}

async function main() {
  const config = resolveConfig();
  const prisma = new PrismaClient();

  try {
    const existing = await prisma.admin.findUnique({
      where: { email: config.email },
    });

    if (existing) {
      console.log(`✓ Admin already exists (${config.email}), skipping seed.`);
      return;
    }

    const passwordHash = await bcrypt.hash(config.password, 10);

    await prisma.admin.create({
      data: {
        id: createId(),
        name: config.name,
        email: config.email,
        passwordHash,
      },
    });

    console.log(`✓ Admin created: ${config.email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
