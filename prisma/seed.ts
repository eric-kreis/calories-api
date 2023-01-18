import { PrismaClient, Roles } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const regular = await prisma.user.upsert({
    where: { email: 'regular@olby.com' },
    create: {
      name: 'Regular User',
      email: 'regular@olby.com',
      password: 'regular',
      role: Roles.REGULAR,
      config: {
        caloriesPerDay: 2000,
      },
    },
    update: {},
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@olby.com' },
    create: {
      name: 'Manager User',
      email: 'manager@olby.com',
      password: 'manager',
      role: Roles.MANAGER,
      config: {
        caloriesPerDay: 2000,
      },
    },
    update: {},
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@olby.com' },
    create: {
      name: 'Admin User',
      email: 'admin@olby.com',
      password: 'admin',
      role: Roles.ADMIN,
      config: {
        caloriesPerDay: 2000,
      },
    },
    update: {},
  });

  console.log({ regular, manager, admin });
}

main();
