import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { CommonStatus } from '../shared/enums';

const prisma = new PrismaClient();

async function main() {
  const mobile = '0999999999';
  const email = 'admin@example.app';
  const password = 'password';

  // hash password
  const hashed = await bcrypt.hash(password, 12);

  // Check existing super admin
  const existing = await prisma.user.findFirst({
    where: { mobile }
  });

  if (existing) {
    console.log('Super admin already exists:', existing.mobile);
    return;
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      mobile,
      email,
      password: hashed,
      status: CommonStatus.ACTIVE,
    },
  });

  console.log('Super admin created:');
  console.log(' User ID:', user.id);
  console.log(' Mobile:', mobile);
  console.log(' Email:', email);
}

async function bootstrapSeed() {
  try {
    await main();
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

void bootstrapSeed();
