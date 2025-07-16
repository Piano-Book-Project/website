import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.admin.upsert({
    where: { username: 'sysadmin' },
    update: {},
    create: {
      username: 'sysadmin',
      password: 'sysadmin1234!',
      nickname: '백살이',
    },
  });
  console.log('Admin user created or already exists:', admin);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 